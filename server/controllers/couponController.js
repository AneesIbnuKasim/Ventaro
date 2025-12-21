const CouponService = require("../services/CouponService");
const { couponValidation } = require("../utils/validation");
const BaseController = require("./baseController");

class CouponController extends BaseController {
    static fetchCoupons = BaseController.asyncHandler(async(req, res)=>{
        const coupons = await CouponService.fetchCoupons(req.query)
        BaseController.logAction('ALL-COUPONS',coupons)
        BaseController.sendSuccess(res,'Coupon fetched',coupons)
    })

    static addCoupon = BaseController.asyncHandler(async (req, res)=>{
        const validatedData = BaseController.validateRequest(couponValidation, req.body)
        const coupon = await CouponService.addCoupon(validatedData)
        BaseController.sendSuccess(res,'Coupon added successfully', coupon, 201)
    })

    static updateCoupon = BaseController.asyncHandler(async(req, res)=>{
        console.log('reqbody', req.body);
        const validatedData = BaseController.validateRequest(couponValidation, req.body)
        const coupon = await CouponService.updateCoupon(req.params.id, validatedData)
        BaseController.sendSuccess(res, 'Coupon updated successfully', coupon)
    })

    static deleteCoupon = BaseController.asyncHandler(async(req, res)=>{
        const couponId = await CouponService.deleteCoupon(req.params.id)
        BaseController.logAction('DELETE_COUPON', couponId)
        BaseController.sendSuccess(res, 'Coupon deleted successfully', couponId)
    })

    static validateCoupon = BaseController.asyncHandler(async(req, res)=>{
        const { code, cartTotal, cartItems } = req.body
        const result = await CouponService.validateCoupon(code, cartTotal, cartItems)
        BaseController.logAction('DELETE_COUPON', result)
        BaseController.sendSuccess(res, 'Coupon deleted successfully', result)
    })

    
}


module.exports = CouponController