const CategoryService = require("../services/CategoryService");
const { addCategoryValidation } = require("../utils/validation");
const BaseController = require("./baseController");

class CategoryController extends BaseController {
    static getAllCategories = BaseController.asyncHandler(async(req, res)=>{
        const categories = await CategoryService.getAllCategories(req, res)
        BaseController.sendSuccess(categories)
    })

    static addCategory = BaseController.asyncHandler(async (req, res)=>{
        const validatedData = BaseController.validateRequest(addCategoryValidation, req.body)
        const category = await CategoryService.addCategory(validatedData)
        BaseController.sendSuccess(res,'Category added successfully', category, 201)
    })
}


module.exports = CategoryController