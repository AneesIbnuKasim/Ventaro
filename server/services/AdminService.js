const Admin = require("../models/Admin")
const { NotFoundError, ConflictError, AuthorizationError, AuthenticationError } = require("../utils/errors")
const { generateAdminToken } = require("../utils/jwt")
const logger = require("../utils/logger")

class AdminService {
    static async login (userData) {
        try {
            const { email, password } = userData
            const admin = await Admin.findByEmail(email)
        
        if (!admin || admin.role !== 'admin') {
            throw new AuthenticationError('Invalid admin credentials')
        }

        const isPasswordMatching = await admin.comparePassword(password)
        if (!isPasswordMatching) {
            logger.error('Invalid password')
            throw new AuthenticationError('Invalid email or password')
        }
        
        if (admin.status === 'banned') {
            logger.warn('Banned admin tried to login:',admin.email)
            throw new AuthorizationError('Admin account has been banned')
        }

        const token = generateAdminToken({
            id: admin._id,
            email: admin.email,
            role: admin.role,
        })
        logger.info(`Admin logged in: ${email}`)

        return {
            token,
            admin: admin.getPublicProfile()
            }
        } catch (error) {
            logger.error('Admin login error',error)
            throw error
        }
    }
}

module.exports = AdminService