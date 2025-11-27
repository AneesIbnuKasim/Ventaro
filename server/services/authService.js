const User = require('../models/User')
const logger = require('../utils/logger')
const { generateUserToken, generateResetToken, verifyResetToken } = require('../utils/jwt')
const { sendOtpEmail, generateOtp } = require('../utils/nodeMailer')
const { ConflictError, ValidationError, GenericError } = require('../utils/errors')

class AuthService {
    static async register(userData) {
       try {
        const { name, email, password } = userData
        const existingUser = await User.findByEmail(userData.email)
        
        if(existingUser) {
        throw new ConflictError('User already exist')
       }

       const user = new User({
        name,
        email,
        password
       })

       await user.save()

       const otpDetails = generateOtp('EMAIL_VERIFICATION')
       if (!otpDetails) {
        throw new GenericError('Otp generation failed')
       }

       user.otpDetails = otpDetails
       await user.save()

       sendOtpEmail( user._id, user.name, user.email, otpDetails.code, otpDetails.purpose)

       const token = generateUserToken({
        id: user._id,
        email: user.email,
        role: user.role
       })
       
       logger.info(`New user registered: ${user.email}`)
       
       return {
        user: user.getPublicProfile(),
        token
    }
    
    token
       } catch (error) {
            logger.error('Registration error:', error);
            throw error        
       }
    }

    //Mail otp verification logic
    static verifyOtp = async(data)=>{
        try {
            const { userId, purpose, otp } = data
            console.log('otpDetails:', otp);
            
            const user = await User.findById(userId)
            if (!user) {
                logger.error('User not found')
                throw new Error('User not found')
            }

            if (!purpose === user.otpDetails.purpose) {
                logger.error('purpose mismatch')
                throw new Error('Invalid OTP type')
            }

            const now = new Date()
            const isExpired = now > user.otpDetails.expiresAt
            if (isExpired) {
                logger.error('Otp expired')
                throw new Error('Otp expired')
            }

            const isMatching = await user.compareOtp(otp)

            if (!isMatching) {
                logger.error('Otp not valid')
                throw new Error('Otp not valid')
            }
            user.otpDetails = null

            if (purpose === 'EMAIL_VERIFICATION') {
                user.isVerified = true

                await user.save()

                logger.info('Email verified')
                
                return {
                message: 'Email Verified successfully',
                user: user.getPublicProfile(),
                }
            }

            if (purpose === 'PASSWORD_RESET') {
                await user.save()
                
                const resetToken = generateResetToken({id: user._id})

                logger.info('Password reset otp verified')
                return {
                    message: 'Reset Token generated',
                    resetToken: resetToken,
                    userId: user._id
                }
            }
                
        } catch (error) {
            logger.error(error)
            throw error
        }
    }

    //User login logic
    static login = async(userData)=>{
        try {
            const { email, password } = userData
        const user = await User.findByEmail(email)

        if (!user) {
            throw new Error('Invalid email or password')
        }

        if (user.status === 'banned') {
            throw new Error('Your account has been banned. Please contact administrator.')
        }

        const isPasswordValid = await user.comparePassword(password)
        
        if (!isPasswordValid) {
            throw new Error('Invalid email or password')
        }

        user.lastLogin = new Date()
        await user.save()

        const token = generateUserToken({
            id: user._id,
            email: user.email,
            role: user.role
        })


        logger.info(`User logged in: ${email}`)

        return {
            user: user.getPublicProfile(),
            token
        }

        } catch (error) {
            logger.error('Login error',error)
            throw error
        } 
    }

    static async changePassword (userId, passwordData) {
        try {
        const { currentPassword, newPassword } = passwordData

        const user = await User.findById(userId)

        if (!user) {
             throw new Error('User not found')
        }

        const isCurrentPasswordValid = await user.comparePassword(currentPassword)
        if (!isCurrentPasswordValid) {
            throw new Error('Current password is incorrect')
        }

        user.password = newPassword
        await user.save()

        logger.info('Password changed successfully')

        return true
        } catch (error) {
            logger.error('Password change error')
            throw error
        }
    }

    //Request password reset otp to reset password
    static async requestPasswordReset(validatedData) {
       try {
         const { email } = validatedData
        const user = await User.findByEmail(email)
        if (!user) {
            throw new Error('User not found')
        }

        const otpDetails = generateOtp('PASSWORD_RESET')
        if (!otpDetails) {
        throw new Error('Otp generation failed')
       }

       user.otpDetails = otpDetails
       await user.save()

       sendOtpEmail(user._id, user.name, email, otpDetails.code)

       return {userId: user._id,
               purpose: otpDetails.purpose
       }
       } catch (error) {
            throw error
       }
    }

    //Reset password
    static async resetPassword(passwordData) {
        try {

            logger.warn('Its hereeeeeeeeee')
            const { resetToken, newPassword } = passwordData

            console.log('resetToken:', resetToken)
            console.log('newPassword::', newPassword)
            const decoded = verifyResetToken(resetToken)

        if (!decoded) {
            logger.error('Reset-token is not valid or expired')
            throw new Error ('Reset-token is not valid or expired')
        }

        const user = await User.findById(decoded.id)

        if (!user) {
            logger.error('User not found for the reset-token')
            throw new Error('Cannot update password! User not found')
        }

        user.password = newPassword
        
        await user.save()

        logger.info('Password reset successful')
        return {
            user,
            message: 'Password reset successful'
        }
        } catch (error) {
            logger.error('Password reset failed')
            throw error
        }
    }
  
}

module.exports = AuthService