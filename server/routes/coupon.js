const express = require('express')
const { authenticateAdmin } = require('../middlewares/auth')
const CategoryController = require('../controllers/categoryController')
const CouponController = require('../controllers/couponController')

const router = express.Router()

//coupon api handlers
router.get('/', authenticateAdmin, CouponController.fetchCoupons)
router.post('/', authenticateAdmin, CouponController.addCoupon)
router.put('/:id',authenticateAdmin ,CouponController.updateCoupon)
router.delete('/:id', authenticateAdmin, CouponController.deleteCoupon)

module.exports = router