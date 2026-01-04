const CategoryService = require("../services/CategoryService");
const { addCategoryValidation, categoryValidation } = require("../utils/validation");
const BaseController = require("./baseController");

class CategoryController extends BaseController {
    static getAllCategories = BaseController.asyncHandler(async(req, res)=>{
        const categories = await CategoryService.getAllCategories(req, res)
        BaseController.logAction('ALL-CATEGORY',categories)
        BaseController.sendSuccess(res,'Category fetched',categories)
    })

    static addCategory = BaseController.asyncHandler(async (req, res)=>{
        const { image, ...formData } = req.body
        const validatedData = BaseController.validateRequest(categoryValidation, formData)
        const category = await CategoryService.addCategory(validatedData, req.file.filename)
        BaseController.sendSuccess(res,'Category added successfully', category, 201)
    })

    static updateCategory = BaseController.asyncHandler(async(req, res)=>{
        console.log('reqbody', req.body);
        
        const validatedData = BaseController.validateRequest(categoryValidation, req.body)
        const updated = await CategoryService.updateCategory(req.params.id, validatedData)
        BaseController.sendSuccess(res, 'Category updated successfully', updated)
    })

    static deleteCategory = BaseController.asyncHandler(async(req, res)=>{
        const deleted = await CategoryService.deleteCategory(req.params.id)
        BaseController.logAction('DELETE_CATEGORY', deleted)
        BaseController.sendSuccess(res, 'Category deleted successfully')
    })

    
}


module.exports = CategoryController