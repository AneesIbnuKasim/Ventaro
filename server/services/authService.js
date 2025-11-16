const User = require('../models/User')
const logger = require('../utils/logger')
const { generateUserToken } = require('../utils/jwt')
const bcrypt = require('bcrypt')
const { BCRYPT_ROUND } = require('../config/config')

class AuthService {
    static async register(userData) {
       try {
        const { name, email, password } = userData
        const existingUser = await User.findByEmail(userData.email)
        
        if(existingUser) {
        throw new Error('User with this email already exists')
       }
       
       const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUND)

       const user = new User({
        name,
        email,
        password: hashedPassword

       })
       await user.save()

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
            throw error;        
       }

    }

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