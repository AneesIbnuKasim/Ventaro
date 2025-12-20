const CartService = require("../services/CartService");
const BaseController = require("./baseController");

class CartController extends BaseController {
    
    static fetchCart = BaseController.asyncHandler(async(req, res) => {
        const cart = await CartService.fetchCart(req, res)
        BaseController.logAction('FETCH-CART', cart)
        BaseController.sendSuccess(res, 'Cart fetched Successfully', cart, 200)
    })

    static addToCart = BaseController.asyncHandler(async(req, res) => {
        const product = await CartService.addToCart(req, res)
        BaseController.logAction('ADD-TO-CART', product)
        BaseController.sendSuccess(res, 'Product added to cart', product, 201)
    })

    static syncCart = BaseController.asyncHandler(async(req, res) => {
        const items = await CartService.syncCart(req, res)
        BaseController.logAction('SYNC-CART', items)
        BaseController.sendSuccess(res, 'Cart synced successfully', items, 200)
    })

    static removeFromCart = BaseController.asyncHandler(async(req, res) => {
        const items = await CartService.removeFromCart(req, res)
        BaseController.logAction('REMOVE-FROM-CART', items)
        BaseController.sendSuccess(res, 'Product removed from cart.', items, 200)
    })
}

module.exports = CartController