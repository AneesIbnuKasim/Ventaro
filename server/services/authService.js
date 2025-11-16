const User = require('../models/User')
const logger = require('../utils/logger')

class AuthService {
    static async register(userData) {
       const existingUser = await User.findByEmail(userData.email)
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


    }
}