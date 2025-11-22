const express = require('express')
const { authenticateUser } = require('../middlewares/auth')
const UserController = require('../controllers/UserController')
const { default: upload } = require('../config/multer')
const checkUserStatus = require('../middlewares/checkUserStatus')

const router = express.Router()

router.get('/me', checkUserStatus, authenticateUser, UserController.getProfile)
router.put('/profile', checkUserStatus, authenticateUser, UserController.updateProfile)
router.put('/profile/avatar', upload.single('avatar'), checkUserStatus, authenticateUser, UserController.updateAvatar)
router.post('/profile/address', checkUserStatus, authenticateUser, UserController.addAddress)

module.exports = router