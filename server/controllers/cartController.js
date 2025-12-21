const CartService = require("../services/CartService");
const BaseController = require("./baseController");

class CartController extends BaseController {
    
    static fetchCart = BaseController.asyncHandler(async(req, res) => {
        const cart = await CartService.fetchCart(req.user._id)
        BaseController.logAction('FETCH-CART', cart)
        BaseController.sendSuccess(res, 'Cart fetched Successfully', cart, 200)
    })

    static addToCart = BaseController.asyncHandler(async(req, res) => {
        const product = await CartService.addToCart(req.user._id, {
            productId: req.body.productId,
            quantity: 1
        })
        BaseController.logAction('ADD-TO-CART', product)
        BaseController.sendSuccess(res, 'Product added to cart', product, 201)
    })

    static syncCart = BaseController.asyncHandler(async(req, res) => {
        const { cart, warnings } = await CartService.syncCart(req.body, req.user._id)
        BaseController.logAction('SYNC-CART', items)
        BaseController.sendSuccess(res, 'Cart synced successfully', { cart, warnings }, 200)
    })

    static removeFromCart = BaseController.asyncHandler(async(req, res) => {
        const items = await CartService.removeFromCart(req.params.id, req.user._id)
        BaseController.logAction('REMOVE-FROM-CART', items)
        BaseController.sendSuccess(res, 'Product removed from cart.', items, 200)
    })
}

module.exports = CartController