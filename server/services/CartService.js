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
        try {
            const { itemId } = req.params

        console.log('here in remove cart handler:', itemId);
        
        const updatedCart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { items: { _id: itemId } } },
            {
                new: true
            }
        ).populate('items.product')

        console.log('updated cart:', updatedCart);
        

        if (!updatedCart) {
            return sendError(res, 'Product not found', 404)
        }

        return updatedCart
        } catch (error) {
            throw error
        }

    }

    //SYNC CART -> ADD/DECREASE QUANTITY
    static async syncCart(req, res) {
        const items = req.body
        console.log('data in sync:', items);
        const userId = req.user._id
        
        if (!Array.isArray(items)) {
            return sendError(res, 'Invalid cart data', 400)
        }

        const productIds = items.map(i=>i.productId)

        
        
        const products = await Product.find({
            _id: { $in: productIds }
        })
        console.log('prods', products);



        const productMap = new Map(
            products.map(p=> [p._id.toString(), p])
        )
        console.log('prod map', productMap);
        

        const cartItems = items.map(i=> {
            const product = productMap.get(i.productId)

            if (!product) return null

            return {
                product: product._id,
                price: product.price,
                quantity: i.quantity
            }
        })

        const cart = await Cart.findOne({user: userId})
        
        
        
        cart.items = cartItems
        
        console.log('cart check', cart);
        //recalculate total price and quantity
        const totalQuantity = this.recalculateTotalQuantity(cart)
        const totalPrice = this.recalculateTotalPrice(cart)

        cart.totalQuantity = totalQuantity
        cart.totalPrice = totalPrice

        await cart.save()
        console.log('final cart:', cart);
        

        return cart
        
    }
}

module.exports = CartService