const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')
const config = require('../config/config')

const generateUserToken = (payload)=>{
    try {
        return jwt.sign(payload,
            config.USER_SECRET,{
            expiresIn: config.EXPIRES_IN
            })
    } catch (error) {
        logger.error('Error creating user token',error)
        throw new Error('Token generation failed')
    }
}

const generateAdminToken = (payload)=>{
   try {
         return jwt.sign(payload, 
        config.ADMIN_SECRET, {
            expiresIn: config.EXPIRES_IN
        }
    )
   } catch (error) {
        logger.error('Error creating admin token', error)
        throw new Error('Admin token generation failed')
   }
}

module.exports = {
    generateUserToken,
    generateAdminToken,

}