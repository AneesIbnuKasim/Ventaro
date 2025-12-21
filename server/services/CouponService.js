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

        if (categoryData.name) {
            const existing = await Coupon.findOne({name: couponData.name, _id: {$ne : couponId}})
            if (existing) {
                throw new ConflictError('Coupon name already exist')
            }
        }

        Object.assign(coupon, couponData)

        await coupon.save()

        return coupon

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
}

module.exports = CouponService