const express = require('express')
const AuthController = require('../controllers/authController')

const router = express.Router()

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/verify-otp', AuthController.verifyOtp)
router.put('/reset-password', AuthController.resetPassword)


module.exports = router