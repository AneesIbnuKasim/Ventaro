const { decode } = require("jsonwebtoken")
const jwt = require('jsonwebtoken')
const { verifyUserToken, verifyAdminToken } = require("../utils/jwt")
const User = require("../models/User")
const Admin = require("../models/Admin")
const { NotFoundError, AuthorizationError } = require("../utils/errors")
const checkUserStatus = async(req, res, next)=>{
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            next()
        }

        let decoded
        try {
            decoded = verifyUserToken
        } catch (error) {
            try {
            decoded = verifyAdminToken
            } catch (error) {
                next()
            }
        }

        const user = await User.findById(decoded.id)
        const admin = await Admin.findById(decoded.id)

        if (!user) {
            logger.error('User not found')
            throw NotFoundError('User not found')
        }

        if (!admin) {
            logger.error('Admin not found')
            throw NotFoundError('Admin not found')
        }

        if (user.status === 'banned' || AdminController.status === 'banned') {
            logger.error('User account is banned, Contact support')
            throw AuthorizationError('User account is banned, Contact support')
        }

        next()
    } catch (error) {
        logger.error('Check user status error')
        throw error
    }
}