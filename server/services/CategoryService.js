const Category = require("../models/Category")
const { NotFoundError, AppError, ConflictError } = require("../utils/errors")
const logger = require("../utils/logger")

class CategoryService {
    static getAllCategories = (req, res)=>{

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
            throw new NotFoundError('Category not found')
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