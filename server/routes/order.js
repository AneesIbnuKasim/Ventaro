const express = require('express')
const { authenticateUser } = require('../middlewares/auth')
const OrderController = require('../controllers/orderController')
const router = express.Router()

router.get('/', authenticateUser, OrderController.fetchOrders)
router.put('/:orderId/cancel', authenticateUser, OrderController.cancelOrder)


module.exports = router