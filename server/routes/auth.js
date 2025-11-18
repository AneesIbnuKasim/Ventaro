const express = require('express')
const AuthController = require('../controllers/authController')
const { authenticateUser } = require('../middlewares/auth')

const router = express.Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/verify-otp', AuthController.verifyEmail)
router.post('/forgot-password', AuthController.requestPasswordReset)
router.put('/change-password', authenticateUser, AuthController.changePassword)



module.exports = router