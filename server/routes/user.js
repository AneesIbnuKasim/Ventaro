const express = require('express')
const { authenticateUser } = require('../middlewares/auth')
const UserController = require('../controllers/UserController')
const { default: upload } = require('../config/multer')

const router = express.Router()

router.get('/me', authenticateUser, UserController.getProfile)
router.put('/profile', authenticateUser, UserController.updateProfile)
router.put('/profile/avatar', upload.single('avatar'), authenticateUser, UserController.updateAvatar)

module.exports = router