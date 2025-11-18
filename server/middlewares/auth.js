const { verifyUserToken } = require('../utils/jwt')
const logger = require('../utils/logger')
const { sendError } = require('../utils/response')

const authenticateUser = async(req, res, next)=>{
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return sendError(res, 'Access token required', 401)
        }

        const token = authHeader.substring(7)

        const decoded = verifyUserToken(token)

        const user = await User.findById(decoded.id)

        if (!user) {
            return sendError(res, 'User not found', 401)
        }

        if (user.status === 'banned') {
            return sendError(res, 'User has been banned', 403)
        }

        req.user = user
        next()
    } catch (error) {
        logger.error('User authentication failed')
        sendError(res, 'User token invalid or expired', 401)
    }
}