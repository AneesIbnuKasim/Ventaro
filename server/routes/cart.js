const express = require('express')
const { authenticateUser } = require('../middlewares/auth')
const CartController = require('../controllers/cartController')

const router = express.Router()

//category api handlers
router.get('/', authenticateUser, CartController.fetchCart)
router.post('/', authenticateUser, CartController.addToCart)
router.put('/', authenticateUser, CartController.syncCart)
router.delete('/:itemId', authenticateUser, CartController.removeFromCart)

//user action apis
router.post('/apply-coupon', authenticateUser, CartController.applyCoupon)
// router.delete('/remove-coupon', authenticateUser, CartController.removeCoupon)



module.exports = router