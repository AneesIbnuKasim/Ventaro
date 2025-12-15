const User = require("../models/User")
const { NotFoundError } = require("../utils/errors")
const logger = require("../utils/logger")
const { sendError } = require("../utils/response")
const path = require('path')
const fs = require('fs')
const Address = require("../models/Address")
const mongoose = require('mongoose')

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
            return {user: profileData}
            
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

            return {user: user.getPublicProfile()}
            
        } catch (error) {
            logger.error('Profile update failed')
            throw error
        }
    }

    static updateAvatar = async(req)=>{

        console.log('in avatar');
        
        try {
            if (!req.file) {
            logger.error('No file uploaded')
            throw new Error('No file uploaded')
        }
        const userId = req.user._id.toString()
        const user = await User.findById(userId)

        if (user.avatar) {
            const oldPath = path.join('uploads/avatars', user.avatar)

            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath)
            }
        }
        
        user.avatar = req.file.filename
        await user.save()
        
        return {avatar: req.file.filename}
        } catch (error) {
            logger.error('Avatar updating failed')
            throw error
        }
    }

    static addAddress = async(req, addressData)=>{
        try {
            const userId = req.user._id.toString()
            const user = await User.findById(userId)
            if (!user) {
                logger.error('User not found')
                throw new NotFoundError('User not found')
            }
            
        const data = {...addressData, userId}
        
        if (user.addresses.length === 0) {
            
            data.isDefault = true
        }

        const address = await Address.create(data)

        await user.updateOne({$push: {addresses: address._id}}, {new: true})

        logger.info('Address added successfully')
        return address
        } catch (error) {
            logger.error('Adding address failed')
            throw error
        }
    }

    static updateAddress = async(req, updateData)=>{
        try {
        const addressId = req.params.id

        const updatedAddress = await Address.findByIdAndUpdate(addressId, updateData, {
            new: true
        })

        logger.info('Address updated successfully')

        return updatedAddress
        } catch (error) {
            logger.error('Address updating failed')
            throw error
        }
    }

    static deleteAddress = async(req)=>{
        const addressId = req.params.id
        
        await User.findOneAndUpdate({addresses: new mongoose.Types.ObjectId(addressId)},{$pull:{addresses: addressId}},{new: true})

        await Address.findOneAndDelete({_id: addressId})

        return true
    }
}

module.exports = UserService