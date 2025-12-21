const { sendError, sendSuccess } = require("../controllers/baseController");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const { NotFoundError, ValidationError } = require("../utils/errors");
const CouponService = require("./CouponService");

class CartService {
  //FETCH CART ITEMS
  static async fetchCart(userId) {
    try {
      userId = userId.toString();

      const cart = await Cart.findOne({ user: userId }).populate(
        "items.product"
      );

      console.log("cart in be", cart);

      //   if (!cart) return []

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
    return cart.items.reduce((acc, item) => acc + item.itemTotal, 0);
  }

  static revalidateAppliedCoupon = async (cart, warnings = []) => {
    if (!cart.appliedCoupon) {
      cart.discountTotal = 0;
      cart.grandTotal = cart.subTotal;
      return;
    }

    if (cart.appliedCoupon) {
      try {
        const { discount, finalAmount } = await CouponService.validateCoupon(
          cart.appliedCoupon.code,
          cart.subTotal,
          cart.items
        );
        cart.discountTotal = discount;
        cart.grandTotal = finalAmount;
      } catch (error) {
        //invalid coupon
        cart.appliedCoupon = null;
        cart.discountTotal = 0;
        cart.grandTotal = cart.subTotal;
        warnings.push({ message: "Coupon removed: " + error.message });
      }
    }
  };

  //ADD PRODUCT TO CART
  static async addToCart(userId, { productId, quantity = 1 }) {
    const warnings = []
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new NotFoundError("Product not found", 404);
      }

      const basePrice = product.basePrice;
      const finalUnitPrice = basePrice; // discount later here ,
      const itemTotal = finalUnitPrice * quantity;

      //find correct user cart
      let cart = await Cart.findOne({ user: userId });

      console.log("cart in add", cart);
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

      await this.revalidateAppliedCoupon(cart, warnings);

      await cart.save();

      await cart.populate("items.product");

      console.log("populated cart", cart);

      return { items: cart.items };
    } catch (error) {
      throw error;
    }
  }

  //REMOVE FROM CART
  static async removeFromCart(itemId, userId) {
    try {
        const warnings = []
      console.log("here in remove cart handler:", itemId);

      const cart = await Cart.findOneAndUpdate(
        { user: userId },
        { $pull: { items: { _id: itemId } } },
        {
          new: true,
        }
      ).populate("items.product");

      if (!cart) {
        throw new NotFoundError("Product not found", 404);
      }

      cart.totalQuantity = this.recalculateTotalQuantity(cart);
      cart.subTotal = this.recalculateSubTotal(cart);

      await this.revalidateAppliedCoupon(cart, warnings);

      await cart.save();
      return cart;
    } catch (error) {
      throw error;
    }
  }

  //SYNC CART -> ADD/DECREASE QUANTITY
  static async syncCart(items, userId) {
    try {
      if (!Array.isArray(items)) {
        throw new ValidationError("Invalid cart data", 400);
      }

      const productIds = items.map((i) => i.productId);

      const products = await Product.find({
        _id: { $in: productIds },
      });
      console.log("prods", products);

      //products from DB stored in Map object for minimal queries,
      const productMap = new Map(products.map((p) => [p._id.toString(), p]));
      console.log("prod map", productMap);

      const warnings = [];
      const cartItems = items
        .map((i) => {
          const product = productMap.get(i.productId);

          if (!product) return null;

          //check stock
          const requestedQuantity = Math.max(1, i.quantity);
          const allowedQuantity = Math.min(requestedQuantity, product.stock);

          //if no stock
          if (allowedQuantity === 0) {
            warnings.push({
              productId: product._id,
              message: `${product.name} is out of stock`,
            });
            return null;
          }

          //if low stock
          if (allowedQuantity < requestedQuantity) {
            warnings.push({
              productId: product._id,
              message: `Only ${allowedQuantity} items available for ${product.name}`,
            });
          }

          const basePrice = product.basePrice;
          const finalUnitPrice = basePrice; // discount hook
          const itemTotal = finalUnitPrice * allowedQuantity;

          return {
            product: product._id,
            quantity: allowedQuantity,
            basePrice,
            finalUnitPrice,
            itemTotal,
          };
        })
        .filter(Boolean);

      const cart = await Cart.findOne({ user: userId });

      if (!cart) throw new NotFoundError("Cart not found");

      cart.items = cartItems;

      console.log("cart check", cart);
      //recalculate totals

      cart.totalQuantity = this.recalculateTotalQuantity(cart);
      cart.subTotal = this.recalculateSubTotal(cart);

      await this.revalidateAppliedCoupon(cart, warnings);

      await cart.save();

      await cart.populate("items.product");

      return { cart, warnings };
    } catch (error) {
      throw error;
    }
  }

  //APPLY COUPON EXPLICITLY
  static applyCoupon = async (userId, code) => {
    const cart = await Cart.findOne({user: userId}).populate('items.product')

    if (!cart) throw new NotFoundError('Cart not found')
    
    const result = await CouponService.validateCoupon(
        code,
        cart.subTotal,
        cart.items
    )

    cart.appliedCoupon = {
        code: result.code,
        discountType: result.discountType,
        discountValue: result.discountValue
    }

    cart.discountTotal = result.discount
    cart.grandTotal = cart.finalAmount

    await cart.save()

    return cart
  }
}

module.exports = CartService;
