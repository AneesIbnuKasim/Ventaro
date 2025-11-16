const User = require('../models/User')
const logger = require('../utils/logger')
const { generateUserToken } = require('../utils/jwt')

class AuthService {
    static async register(userData) {
       try {
        console.log('inhere1');
        const existingUser = await User.findByEmail(userData.email)
        console.log('inhere');
        
        if(existingUser) {
        throw new Error('User with this email already exists')
       }
       
       const user = new User(userData)
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
}

module.exports = AuthService