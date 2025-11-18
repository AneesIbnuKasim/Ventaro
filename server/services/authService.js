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

       const newUserData = await user.save()

       const otpDetails = generateOtp(newUserData)
       if (!otpDetails) {
        throw new Error('Otp generation failed')
       }

       user.otpDetails = otpDetails
       await user.save()

       sendOtpEmail(user.name, user.email, otpDetails.code, user._id)

       const token = generateUserToken({
        id: user._id,
        email: user.email,
        role: user.role
       })
       console.log('token:',token);
       
       logger.info(`New user registered: ${user.email}`)
       
       return {
        user: user.getPublicProfile(),
        token
       }

       } catch (error) {
            logger.error('Registration error:', error);
            throw error        
       }

    }

    //Mail otp verification logic
    static verifyOtp = async(query, data)=>{
        try {
            const { userId } = query
            const { otp } = data
            const user = await User.findById(userId)
            if (!user) {
                logger.error('User not found')
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
            user.isVerified = true
            await user.save()
            logger.info('Email verified')

            return {
            user: user.getPublicProfile(),
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

        const otpDetails = generateOtp(user)
        if (!otpDetails) {
        throw new Error('Otp generation failed')
       }

       user.otpDetails = otpDetails
       await user.save()

       sendOtpEmail(user._id, user.name, email, otpDetails.code)

       return user.email

    }

    
}

module.exports = AuthService