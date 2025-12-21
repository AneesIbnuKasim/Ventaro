const CouponService = require("../services/CouponService");
const { couponValidation } = require("../utils/validation");
const BaseController = require("./baseController");

class CouponController extends BaseController {
    static fetchCoupons = BaseController.asyncHandler(async(req, res)=>{
        const coupons = await CouponService.fetchCoupons(req, res)
        BaseController.logAction('ALL-COUPONS',coupons)
        BaseController.sendSuccess(res,'Coupon fetched',coupons)
    })

    static addCoupon = BaseController.asyncHandler(async (req, res)=>{
        const validatedData = BaseController.validateRequest(couponValidation, req.body)
        const coupon = await CouponService.addCoupon(validatedData)
        BaseController.sendSuccess(res,'Coupon added successfully', coupon, 201)
    })

    static updateCoupon = BaseController.asyncHandler(async(req, res)=>{
        const validatedData = BaseController.validateRequest(couponValidation, req.body)
        const updated = await CouponService.updateCoupon(req.params.id, validatedData)
        BaseController.sendSuccess(res, 'Coupon updated successfully', updated)
    })

    static deleteCoupon = BaseController.asyncHandler(async(req, res)=>{
        const deleted = await CouponService.deleteCoupon(req.params.id)
        BaseController.logAction('DELETE_COUPON', deleted)
        BaseController.sendSuccess(res, 'Coupon deleted successfully')
    })

    
}


module.exports = CouponController