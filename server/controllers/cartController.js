const CartService = require("../services/CartService");
const BaseController = require("./baseController");

class CartController extends BaseController {
    
    static fetchCart = BaseController.asyncHandler(async(req, res) => {
        const cart = await CartService.fetchCart(req, res)
        BaseController.logAction(res, 'FETCH-CART', cart)
        BaseController.sendSuccess(res, 'Cart fetched Successfully', cart, 200)
    })
}

module.exports = CartController