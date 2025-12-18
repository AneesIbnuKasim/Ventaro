const { sendError, sendSuccess } = require("../controllers/baseController");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");

class CartService {
    static async fetchCart(req, res) {
        const userId = req.user._id.toString()

        console.log('userID', userId);
        

        const cart = await Cart.findOne({user: userId})

        console.log('cart in be', cart);
        

        if (!cart) return []
        
        return cart
        
    }
}

module.exports = CartService