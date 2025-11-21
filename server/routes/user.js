const express = require('express')
const { authenticateUser } = require('../middlewares/auth')
const UserController = require('../controllers/UserController')

const router = express.Router()

router.get('/me', authenticateUser, UserController.getProfile)
router.put('/profile', authenticateUser, UserController.updateProfile)

module.exports = router