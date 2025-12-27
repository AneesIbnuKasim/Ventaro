const express = require('express')
const AdminController = require('../controllers/adminController')
const { authenticateAdmin } = require('../middlewares/auth')
const CategoryController = require('../controllers/categoryController')
const ProductController = require('../controllers/ProductController')
const { default:upload } = require('../config/multer')
const OrderController = require('../controllers/orderController')

const router = express.Router()

router.post('/login', AdminController.login)

// orders

router.get('/orders', authenticateAdmin, OrderController.fetchOrders)

module.exports = router