const { sendError, sendSuccess } = require("../controllers/baseController");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");

class CartService {

    //FETCH CART ITEMS
    static async fetchCart(req, res) {
        try {
            const userId = req.user._id.toString()

        const cart = await Cart.findOne({user: userId}).populate('items.product')

        console.log('cart in be', cart);
        
        // if (!cart) return []
        
        return cart
        } catch (error) {
            throw error
        }
    }

    //RECALCULATE CART TOTAL QUANTITY HELPER
    static recalculateTotalQuantity = (cart) => {
        const totalQuantity = cart.items.reduce((acc, item) => (
            acc += item.quantity
        ), 0)
        return totalQuantity
    }

    //RECALCULATE CART TOTAL PRICE HELPER FUNCTION
    static recalculateTotalPrice = (cart) => {
        const totalPrice = cart.items.reduce((acc, item) => (
            acc += item.quantity * item.price
        ), 0)
        return totalPrice
    }

    //ADD PRODUCT TO CART
    static async addToCart(req, res) {
        try {
            const userId = req.user._id
        const { productId, quantity = 1 } = req.body

        const product = await Product.findById(productId)
        if (!product) {
            return sendError(res, 'Product not found', 404)
        }

        //find correct user cart
        let cart = await Cart.findOne({user: userId})

        console.log('cart in add', cart);

        //if no cart -> create one
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: [{
                    product: productId,
                    quantity,
                    price: product.price
                }],
                totalQuantity: quantity,
                totalPrice: product.price * quantity
            })

            await cart.save()
            return {items: cart.items}
        }

        //if cart exist-> check if product exist
        const itemIndex = cart.items.findIndex(item => (
            item.product.toString() === productId
        ))

        //product exist in cart-> update quantity
        itemIndex > -1 ? cart.items[itemIndex].quantity += quantity 

        //else new product
        : cart.items.push({
            product: productId,
            quantity,
            price: product.price
        })

        //recalculate total price and quantity
        const totalQuantity = this.recalculateTotalQuantity(cart)
        const totalPrice = this.recalculateTotalPrice(cart)

        cart.totalQuantity = totalQuantity
        cart.totalPrice = totalPrice

        await cart.save()

        await cart.populate('items.product')

        console.log('populated cart', cart);
        

        return {items: cart.items}
        
        } catch (error) {
        throw error    
        }
        
    }

    //REMOVE FROM CART
    static async removeFromCart (req, res) {
        const { productId } = req.body
    }
}

module.exports = CartService