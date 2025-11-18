const User = require('../models/User')
const logger = require('../utils/logger')
const { generateUserToken } = require('../utils/jwt')
const { sendOtpEmail } = require('../utils/nodeMailer')
const otpGenerator = require('otp-generator')

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

       if (newUserData) {
       const otp = otpGenerator.generate(6,{
        specialChars: false,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false
       })

       
       const otpExp = Date.now()+30*60*1000

       user.otpDetails = {
        code: otp,
        expiresAt: otpExp
       }
       await user.save()

       await sendOtpEmail(user.name, user.email, otp, user._id)
       }

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

       } catch (error) {
            logger.error('Registration error:', error);
            throw error        
       }

    }

    //Email otp verification logic
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
            if (isExpired) return logger.error('Otp expired')

            const isMatching = await user.compareOtp(otp)

            if (!isMatching) {
                return logger.error('Otp not valid')
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
}

module.exports = AuthService