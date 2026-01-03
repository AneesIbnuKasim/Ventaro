const ProductService = require("../services/ProductService");
const { productValidation } = require("../utils/validation");
const BaseController = require("./baseController");

class ProductController extends BaseController {
    static getProducts = BaseController.asyncHandler(async(req, res)=>{
        const products = await ProductService.getProducts(req, res)
        BaseController.logAction('GET_PRODUCTS', products)
        BaseController.sendSuccess(res, 'Products fetched successfully', products, 200)
    })

    static getProductsByCategory = BaseController.asyncHandler(async(req, res)=>{
        const products = await ProductService.getProductsByCategory(req, res)
        BaseController.logAction('GET_PRODUCTS', products)
        BaseController.sendSuccess(res, 'Products fetched successfully', products, 200)
    })

    static getProduct = BaseController.asyncHandler(async(req, res)=>{
        const result = await ProductService.getProduct(req.params.id, req.query.userId)
        BaseController.logAction('GET_PRODUCT', result)
        BaseController.sendSuccess(res, 'Product fetched successfully', result, 200)
    })

    static submitReview = BaseController.asyncHandler(async(req, res)=>{
        const product = await ProductService.submitReview(req.params.id, req.body, req.user?._id)
        BaseController.logAction('SUBMIT_REVIEW', product)
        BaseController.sendSuccess(res, 'Product review submitted successfully', product, 200)
    })

    static addProduct = BaseController.asyncHandler(async(req, res)=>{
        const { images, ...formData } = req.body
        const validatedData = BaseController.validateRequest(productValidation, formData)
        const product = await ProductService.addProduct(req)
        BaseController.logAction('ADD_PRODUCT', product)
        console.log('product in controller:', product);
        
        BaseController.sendSuccess(res, 'Product added successfully', product, 201)
    })

    static editProduct = BaseController.asyncHandler(async(req, res)=>{
        const { images, ...formData } = req.body
        const validatedData = BaseController.validateRequest(productValidation, formData)
        const updated = await ProductService.editProduct(req.params.id, validatedData, req)
        BaseController.logAction('EDIT_PRODUCT', updated)
        BaseController.sendSuccess(res, 'Product updated successfully', updated, 200)
    })

    static deleteProduct = BaseController.asyncHandler(async(req, res)=>{
        const product = ProductService.deleteProduct(req.params.id)
        BaseController.logAction('DELETE_PRODUCT', product)
        BaseController.sendSuccess(res, 'Product deleted successfully')
    })

    static searchSuggestions = BaseController.asyncHandler(async(req, res)=>{
        const suggestions = await ProductService.searchSuggestions(req)
        BaseController.logAction('GET_SUGGESTIONS', suggestions)
        BaseController.sendSuccess(res, 'Suggestion fetched successfully', suggestions, 200)
    })

    static fetchSearch = BaseController.asyncHandler(async(req, res)=>{
        const result = await ProductService.fetchSearch(req)
        console.log('search result:',result);
        
        BaseController.logAction('SEARCH_PRODUCT', result)
        BaseController.sendSuccess(res, 'Search products fetched successfully', result, 200)
    })

    // static fetchSearch = (req) => {
    //     console.log('req:'. req.query);
    // }
}

module.exports = ProductController