const ProductService = require("../services/ProductService");
const { productValidation } = require("../utils/validation");
const BaseController = require("./baseController");

class ProductController extends BaseController {
    static addProduct = BaseController.asyncHandler(async(req, res)=>{
        const validatedData = BaseController.validateRequest(productValidation, req.body)
        const product = await ProductService.addProduct(validatedData)
        BaseController.logAction('ADD_PRODUCT', product)
        BaseController.sendSuccess(res, 'Product added successfully', product, 201)
    })

    static editProduct = BaseController.asyncHandler(async(req, res)=>{
        const validatedData = BaseController.validateRequest(productValidation, req.body)
        const updated = await ProductService.editProduct(req.params.id, validatedData)
        BaseController.logAction('EDIT_PRODUCT', updated)
        BaseController.sendSuccess(res, 'Product updated successfully', updated, 200)
    })

    static deleteProduct = BaseController.asyncHandler(async(req, res)=>{
        const product = ProductService.deleteProduct(req.params.id)
        BaseController.logAction('DELETE_PRODUCT', product)
        BaseController.sendSuccess(res, 'Product deleted successfully')
    })
}

module.exports = ProductController