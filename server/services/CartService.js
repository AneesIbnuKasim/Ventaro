const { sendError, sendSuccess } = require("../controllers/baseController");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");

class CartService {
  //FETCH CART ITEMS
  static async fetchCart(req, res) {
    try {
      const userId = req.user._id.toString();

      const cart = await Cart.findOne({ user: userId }).populate(
        "items.product"
      );

      console.log("cart in be", cart);

      // if (!cart) return []

      return cart;
    } catch (error) {
      throw error;
    }
  }

  //CALCULATE CART TOTAL QUANTITY
  static recalculateTotalQuantity = (cart) => {
    return cart.items.reduce((acc, item) => acc + item.quantity, 0);
  };

  //CALCULATE CART SUBTOTAL-BEFORE DISCOUNT
  static recalculateSubTotal = (cart) => {
    return cart.items.reduce(
      (acc, item) => acc + item.quantity * item.basePrice,
      0
    );
  };

  //CALCULATE GRAND TOTAL-AFTER DISCOUNT
  static recalculateGrandTotal(cart) {
    return cart.items.reduce(acc, (item) => acc + itemTotal, 0);
  }

  //ADD PRODUCT TO CART
  static async addToCart(req, res) {
    try {
      const userId = req.user._id;
      const { productId, quantity = 1 } = req.body;

      const product = await Product.findById(productId);
      if (!product) {
        return sendError(res, "Product not found", 404);
      }

      console.log("cart in add", cart);

      const basePrice = product.basePrice;
      const finalUnitPrice = basePrice; // discount later here ,
      const itemTotal = finalUnitPrice * quantity;

      //find correct user cart
      let cart = await Cart.findOne({ user: userId });

      //if no cart -> create one
      if (!cart) {
        cart = new Cart({
          user: userId,
          items: [
            {
              product: productId,
              quantity,
              basePrice,
              finalUnitPrice,
              itemTotal,
            },
          ],
        });

        // await cart.save();
        // return { items: cart.items };
      }

      //if cart exist-> check if product exist
      else {
        const itemIndex = cart.items.findIndex(
          (item) => item.product.toString() === productId
        );

        //product exist in cart-> update quantity
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += quantity;
          cart.items[itemIndex].itemTotal =
            cart.items[itemIndex].quantity *
            cart.items[itemIndex].finalUnitPrice;
        }

        //else new product
        else {
          cart.items.push({
            product: productId,
            quantity,
            basePrice,
            finalUnitPrice,
            itemTotal,
          });
        }
      }

      //recalculate total basePrice and quantity
      cart.totalQuantity = this.recalculateTotalQuantity(cart);
      cart.subTotal = this.recalculateSubTotal(cart);
      cart.discountTotal = 0;
      cart.grandTotal = this.recalculateGrandTotal(cart);

      await cart.save();

      await cart.populate("items.product");

      console.log("populated cart", cart);

      return { items: cart.items };
    } catch (error) {
      throw error;
    }
  }

  //REMOVE FROM CART
  static async removeFromCart(req, res) {
    try {
      const { itemId } = req.params;

      console.log("here in remove cart handler:", itemId);

      const cart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { items: { _id: itemId } } },
        {
          new: true,
        }
      ).populate("items.product");

      console.log("updated cart:", updatedCart);

      if (!cart) {
        return sendError(res, "Product not found", 404);
      }

      cart.totalQuantity = this.recalculateTotalQuantity(cart);
      cart.subTotal = this.recalculateSubTotal(cart);
      cart.discountTotal = 0;
      cart.grandTotal = this.recalculateGrandTotal(cart);

      await cart.save();
      return cart;
    } catch (error) {
      throw error;
    }
  }

  //SYNC CART -> ADD/DECREASE QUANTITY
  static async syncCart(req, res) {
    try {
        const items = req.body;
    console.log("data in sync:", items);
    const userId = req.user._id;

    if (!Array.isArray(items)) {
      return sendError(res, "Invalid cart data", 400);
    }

    const productIds = items.map((i) => i.productId);

    const products = await Product.find({
      _id: { $in: productIds },
    });
    console.log("prods", products);

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));
    console.log("prod map", productMap);

    const cartItems = items
      .map((i) => {
        const product = productMap.get(i.productId);

        if (!product) return null;

        const basePrice = product.basePrice;
        const finalUnitPrice = basePrice; // discount hook
        const itemTotal = finalUnitPrice * i.quantity;

        return {
          product: product._id,
          quantity: i.quantity,
          basePrice,
          finalUnitPrice,
          itemTotal,
        };
      })
      .findLast(Boolean);

    const cart = await Cart.findOne({ user: userId });

    cart.items = cartItems;

    console.log("cart check", cart);
    //recalculate totals

    cart.totalQuantity = this.recalculateTotalQuantity(cart);
    cart.subTotal = this.recalculateSubTotal(cart);
    cart.discountTotal = 0;
    cart.grandTotal = this.recalculateGrandTotal(cart);

    await cart.save();
    
    await cart.populate("items.product");

    return cart;
    } catch (error) {
        throw error
    }
  }
}

module.exports = CartService;
