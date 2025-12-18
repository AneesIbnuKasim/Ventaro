const Category = require("../models/Category")
const { NotFoundError, AppError, ConflictError } = require("../utils/errors")
const logger = require("../utils/logger")

class CategoryService {
    static getAllCategories = async(req, res)=>{
        try {
            const { search='' } = req.query

            const page = parseInt(req.query.page)
            const limit = parseInt(req.query.limit)

            console.log('page and limit', page, limit);
            

            const skip = (page-1)*limit
            const filter = {}

            if (search) filter.name = {$regex: search, $options: 'i'}

            //total filtered category count
            const totalCategories = await Category.countDocuments(filter)
            // .sort({ [sortBy]: sortOrder} )
            
            //paginated filtered docs
            const categories = await Category.find(filter)
            .skip(skip)
            .limit(limit)

            const totalPages = Math.ceil(totalCategories/limit)

            logger.info(`Admin ${req.admin.email} fetched category list (page: ${page})`)
            return { categories,
                pagination: {
                    page,
                    totalPages,
                    totalCategories,
                    limit
                }
            }
        } catch (error) {
            logger.error('Failed fetching categories')
            throw error
        }
    }

    static addCategory = async (categoryData)=>{
        try {
            const { name, description } = categoryData
        
            const category = new Category({
            name,
            description
        })
        
        await category.save()

        return category
        } catch (error) {
            logger.error('Error adding category')
            throw error
        }
    }

    static updateCategory = async(categoryId, categoryData)=>{
        try {
            const category = await Category.findById(categoryId)
        
        if (!category) {
            throw new NotFoundError('Category not foun')
        }

        if (categoryData.name) {
            const existing = await Category.findOne({name: categoryData.name, _id: {$ne : categoryId}})
            if (existing) {
                throw new ConflictError('Category name already exist')
            }
        }

        Object.assign(category, categoryData)

        await category.save()

        return category

        } catch (error) {
            logger.error('Category updating failed')
            throw error
        }
    }

    static deleteCategory = async(categoryId)=>{
        try {
            const category = await Category.findById(categoryId)
            if (!category) throw new NotFoundError('Category not found')
            
            await Category.findByIdAndDelete(categoryId)

            logger.info('Category deleted successfully')
            return category
        } catch (error) {
            logger.error('Category deletion failed')
            throw error
        }
    }
}

module.exports = CategoryService