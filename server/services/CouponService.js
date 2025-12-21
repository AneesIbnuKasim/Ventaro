const { sendError } = require("../controllers/baseController")
const Coupon = require("../models/Coupon")
const { NotFoundError, AppError, ConflictError, ValidationError } = require("../utils/errors")
const logger = require("../utils/logger")
const { sendValidationError } = require("../utils/response")

class CouponService {
    static fetchCoupons = async(query)=>{
        try {
            const { search='' } = query

            console.log('search:::',search);
            

            const page = parseInt(query.page)
            const limit = parseInt(query.limit)

            const skip = (page-1)*limit
            const filter = {}

            if (search) filter.code = {$regex: search, $options: 'i'}

            //total filtered coupon count
            const totalCoupons = await Coupon.countDocuments(filter)
            // .sort({ [sortBy]: sortOrder} )
            
            //paginated filtered docs
            const coupons = await Coupon.find(filter)
            .skip(skip)
            .limit(limit)

            const totalPages = Math.ceil(totalCoupons/limit)

            return { coupons,
                pagination: {
                    page,
                    totalPages,
                    totalCoupons,
                    limit
                }
            }
        } catch (error) {
            logger.error('Failed fetching coupons')
            throw error
        }
    }

    static addCoupon = async (couponData)=>{
        try {
            const coupon = new Coupon(couponData)
        
        await coupon.save()

        return coupon
        } catch (error) {
            logger.error('Error adding coupon')
            throw error
        }
    }

    static updateCoupon = async(couponId, couponData)=>{
        try {
            const coupon = await Coupon.findById(couponId)
        
        if (!coupon) {
            throw new NotFoundError('Coupon not found')
        }

        if (couponData.code) {
            const existing = await Coupon.findOne({code: couponData.code.toUpperCase(), _id: {$ne : couponId}})
            
            if (existing) {
                throw new ConflictError('Coupon code already exist')
            }
        }

        Object.assign(coupon, couponData)

        await coupon.save()

        return {coupon}

        } catch (error) {
            logger.error('Coupon updating failed')
            throw error
        }
    }

    static deleteCoupon = async(couponId)=>{
        try {
            const coupon = await Coupon.findById(couponId)
            if (!coupon) throw new NotFoundError('Coupon not found')
            
            await Coupon.findByIdAndDelete(couponId)

            logger.info('Coupon deleted successfully')
            return couponId
        } catch (error) {
            logger.error('Coupon deletion failed')
            throw error
        }
    }

    static async validateCoupon (code, cartTotal, cartItems) {

        if (!code || !cartTotal) throw new NotFoundError('Coupon code & cart total required', 404) 
        
        const coupon = await Coupon.findOne({code: code.toUpperCase()})

        //EXIST CHECK
        if (!coupon) throw new NotFoundError('Invalid coupon code', 404)
        
        //ACTIVE CHECK
        if (!coupon.isActive) throw new ValidationError('Coupon not active', 400)
        
        //EXPIRY CHECK
        if (coupon.endDate < new Date()) throw new ValidationError('Coupon expired', 400)

        //USAGE LIMIT CHECK
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new ValidationError('Coupon usage limit exceeded', 400)
        
        //MINIMUM CART VALUE
        if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) throw new ValidationError(`Minimum cart value ${coupon.minOrderAmount} required`, 400)

        //category check
        if (coupon.applicableCategories.length) {

            const isApplicable = cartItems.some(item => (
                coupon.applicableCategories.includes(item.product.categoryId)
            ))

            if (!isApplicable) throw new ValidationError('Coupon not applicable to selected items', 400)

        }

        //calculate discount

        let discount =0

        if (coupon.discountType === 'PERCENT') {
            discount = (cartTotal * coupon.discountValue)/100
        } else {
            discount = coupon.discountValue
        }

        if (coupon.maxDiscountAmount) {
            discount = Math.min(discount, coupon.maxDiscountAmount)
        }

        const finalAmount = Math.max(cartTotal - discount, 0)
        
        return {
            valid: true,
            discount,
            finalAmount,
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue
            }
        }
    }
}

module.exports = CouponService