const express = require('express')
const AdminController = require('../controllers/adminController')
const { authenticateAdmin } = require('../middlewares/auth')
const CategoryController = require('../controllers/categoryController')
const ProductController = require('../controllers/ProductController')
const { default:upload } = require('../config/multer')
const OrderController = require('../controllers/orderController')
const checkUserStatus = require('../middlewares/checkUserStatus')

const router = express.Router()

router.post('/login', AdminController.login)

// orders

router.get('/orders', authenticateAdmin, OrderController.fetchOrders)
router.put('/orders/:orderId', authenticateAdmin, OrderController.updateStatus)

//profile
router.get('/me', authenticateAdmin, AdminController.getProfile)
router.put('/profile', authenticateAdmin, AdminController.updateProfile)
router.put('/avatar', upload.single('avatar'), authenticateAdmin, AdminController.updateAvatar)

module.exports = router