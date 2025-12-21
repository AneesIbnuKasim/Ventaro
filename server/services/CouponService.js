const { sendError } = require("../controllers/baseController")
const Coupon = require("../models/Coupon")
const { NotFoundError, AppError, ConflictError } = require("../utils/errors")
const logger = require("../utils/logger")

class CouponService {
    static fetchCoupons = async(req, res)=>{
        try {
            const { search='' } = req.query

            console.log('search:::',search);
            

            const page = parseInt(req.query.page)
            const limit = parseInt(req.query.limit)

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

            logger.info(`Admin ${req.admin.email} fetched coupon list (page: ${page})`)
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

    static deleteCoupon = async(req)=>{
        try {
            const couponId = req.params.id
            
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

    static async validateCoupon (req, res) {
        const { code, cartTotal, cartItems } = req.body

        if (!code || !cartTotal) sendError(res, 'Coupon code & cart total required', 404) 
        
        const coupon = await Coupon.findOne({code: code.toUpperCase()})

        //EXIST CHECK
        if (!coupon) sendError(res, 'Invalid coupon code', 404)
        
        //ACTIVE CHECK
        if (!coupon.isActive) sendError(res, 'Coupon expired', 400)
        
        //EXPIRY CHECK
        if (coupon.endDate < new Date()) sendError(res, 'Coupon expired', 400) 

        //USAGE LIMIT CHECK
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) sendError(res, 'Coupon usage limit exceeded', 400)
        
        //MINIMUM CART VALUE
        if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) sendError(res, `Minimum cart value ${coupon,minOrderAmount} required`, 400)

        //category check
        if (coupon.applicableCategories.length) {

            const isApplicable = cartItems.some(item => {
                applicableCategories.includes(item.product.categoryId)
            })

            if (!isApplicable) sendError(res, 'Coupon not applicable to selected items', 400)

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