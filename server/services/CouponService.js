const Coupon = require("../models/Coupon")
const { NotFoundError, AppError, ConflictError } = require("../utils/errors")
const logger = require("../utils/logger")

class CouponService {
    static fetchCoupons = async(req, res)=>{
        try {
            const { search='' } = req.query

            console.log('search:::',search);
            

            // const page = parseInt(req.query.page)
            // const limit = parseInt(req.query.limit)

            // const skip = (page-1)*limit
            const filter = {}

            if (search) filter.name = {$regex: search, $options: 'i'}

            //total filtered coupon count
            const totalCoupons = await Coupon.countDocuments(filter)
            // .sort({ [sortBy]: sortOrder} )
            
            //paginated filtered docs
            const coupons = await Coupon.find(filter)
            // .skip(skip)
            // .limit(limit)

            // const totalPages = Math.ceil(totalCoupons/limit)

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

    static updateCoupon = async(categoryId, categoryData)=>{
        try {
            const coupon = await Coupon.findById(categoryId)
        
        if (!coupon) {
            throw new NotFoundError('Coupon not foun')
        }

        if (categoryData.name) {
            const existing = await Coupon.findOne({name: categoryData.name, _id: {$ne : categoryId}})
            if (existing) {
                throw new ConflictError('Coupon name already exist')
            }
        }

        Object.assign(coupon, categoryData)

        await coupon.save()

        return coupon

        } catch (error) {
            logger.error('Coupon updating failed')
            throw error
        }
    }

    static deleteCoupon = async(categoryId)=>{
        try {
            const coupon = await Coupon.findById(categoryId)
            if (!coupon) throw new NotFoundError('Coupon not found')
            
            await Coupon.findByIdAndDelete(categoryId)

            logger.info('Coupon deleted successfully')
            return coupon
        } catch (error) {
            logger.error('Coupon deletion failed')
            throw error
        }
    }
}

module.exports = CouponService