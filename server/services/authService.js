const User = require('../models/User')
const logger = require('../utils/logger')
const { generateUserToken } = require('../utils/jwt')
const { sendOtpEmail, generateOtp } = require('../utils/nodeMailer')

class AuthService {
    static async register(userData) {
       try {
        const { name, email, password } = userData
        const existingUser = await User.findByEmail(userData.email)
        
        if(existingUser) {
        throw new Error('User with this email already exists')
       }

       const user = new User({
        name,
        email,
        password
       })

       await user.save()

       const otpDetails = generateOtp('EMAIL_VERIFICATION')
       if (!otpDetails) {
        throw new Error('Otp generation failed')
       }

       user.otpDetails = otpDetails
       await user.save()

       sendOtpEmail( user._id, user.name, user.email, otpDetails.code, otpDetails.purpose)

       const token = generateUserToken({
        id: user._id,
        email: user.email,
        role: user.role
       })
       console.log('token:',token);
       
       logger.info(`New user registered: ${user.email}`)
       
       return {
        user: user.getPublicProfile(),
    }
    
    token
       } catch (error) {
            logger.error('Registration error:', error);
            throw error        
       }

    }

    //Mail otp verification logic
    static verifyOtp = async(query, data)=>{
        try {
            const { userId, purpose } = query
            const { otp } = data
            const user = await User.findById(userId)
            if (!user) {
                logger.error('User not found')
                throw new Error('Try again, user not found')
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

            if (purpose === 'EMAIL_VERIFICATION') {
                user.otpDetails = null
                user.isVerified = true
                await user.save()
                logger.info('Email verified')
                return {
                user: user.getPublicProfile(),
                }
            }

            if (purpose === 'PASSWORD_RESET') {
                const resetToken = gene

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
        const { email } = validatedData
        const user = await User.findByEmail(email)
        console.log('user',user);
        
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

       return user.email
    }

    // //verify password reset otp
    // static async verifyResetOtp(userIdQuery, data) {
    //     this.verifyOtp(userIdQuery, data)
        
    // }

    
}

module.exports = AuthService