const express = require('express')
const { authenticateUser } = require('../middlewares/auth')
const PaymentController = require('../controllers/paymentController')
const router = express.Router()

router.post('/razorpay/create-order', authenticateUser, PaymentController.createRazorpayOrder)
router.post('/COD/create-order', authenticateUser, PaymentController.createCodOrder)
router.post('/razorpay/verify', authenticateUser, PaymentController.verifyRazorpayOrder)




module.exports = router