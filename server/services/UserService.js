const User = require("../models/User")
const { NotFoundError } = require("../utils/errors")
const logger = require("../utils/logger")
const { sendError } = require("../utils/response")


class UserService {
    static getProfile = async(req)=>{
        try {
            const id = req.user._id
            const user = await User.findById(id)
            if (!user) {
                logger.error('User not found', id)
                throw sendError(res, 'User not found', 404)
            }
            const profileData = user.getPublicProfile()
            logger.info('profile:', profileData)
            return profileData
            
        } catch (error) {
            logger.error('Error loading user profile')
            throw error
        }
    }

    static updateProfile = async(userId, updateData)=>{
        try {
            delete updateData?.password
            delete updateData?.email
            delete updateData?.role
            delete updateData?.status
            delete updateData?.isVerified

            const user = await User.findByIdAndUpdate(userId, updateData,{
                new: true, runValidators: true
            })

            if (!user) {
                logger.error('User not found')
                throw NotFoundError('User not found')
            }

            return user
            
        } catch (error) {
            logger.error('Profile update failed')
            throw error
        }
    }
}

module.exports = UserService