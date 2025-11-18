const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')
const config = require('../config/config')

const generateUserToken = (payload)=>{
    try {
        return jwt.sign(payload,
            config.JWT.USER_SECRET,{
            expiresIn: config.JWT.EXPIRES_IN
            })
    } catch (error) {
        logger.error('Error creating user token',error)
        throw new Error('Token generation failed')
    }
}

const generateAdminToken = (payload)=>{
   try {
         return jwt.sign(payload, 
        config.JWT.ADMIN_SECRET, {
            expiresIn: config.JWT.EXPIRES_IN
        }
    )
   } catch (error) {
        logger.error('Error creating admin token', error)
        throw new Error('Admin token generation failed')
   }
}

const verifyUserToken = (token)=>{
    try {
        if (!config.JWT.USER_SECRET) {
      throw new Error('JWT_USER_SECRET not configured');
    }
    return jwt.verify(token, config.JWT.USER_SECRET)
    } catch (error) {
        logger.error('User token verification failed')
        throw new Error('User token verification failed')
    }
}

const verifyAdminToken = (token)=>{
    try {
        if (!config.JWT_ADMIN_SECRET) {
      throw new Error('JWT_ADMIN_SECRET not configured');
    }
    return jwt.verify(token, config.JWT.ADMIN_SECRET)
    } catch (error) {
        logger.error('Admin token verification failed')
        throw new Error('Admin token verification failed')
    }
}

module.exports = {
    generateUserToken,
    generateAdminToken,
    verifyUserToken,
    verifyAdminToken
}