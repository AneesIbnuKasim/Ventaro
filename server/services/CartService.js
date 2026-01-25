const { FREE_SHIPPING_THRESHOLD, DELIVERY_FEE } = require("../config/config");
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
        "items.product")

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

  // //CALCULATE SHIPPING FEES
  // static calculateShippingFee = (cart) => {
  //   const estimatedShippingFee = cart.payableTotal > FREE_SHIPPING_THRESHOLD ? DELIVERY_FEE : 0
  // }

  //CALCULATE GRAND TOTAL-AFTER DISCOUNT
  static recalculatePayableTotal(cart) {
    return cart.items.reduce((acc, item) => acc + item.itemTotal, 0);
  }

  static revalidateAppliedCoupon = async (cart, warnings = []) => {
    if (!cart.appliedCoupon) {
      cart.discountTotal = 0;
      cart.payableTotal = cart.subTotal;
      return;
    }

    if (cart.appliedCoupon) {
      try {
        const { discount, finalAmount, coupon } = await CouponService.validateCoupon(
          cart.appliedCoupon.code,
          cart.subTotal,
          cart.items
        );
        cart.discountTotal = discount;

        cart.appliedCoupon = coupon
        
        cart.payableTotal = finalAmount;
      } catch (error) {
        //invalid coupon
        cart.appliedCoupon = null;
        cart.discountTotal = 0;
        cart.payableTotal = cart.subTotal;
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

      const basePrice = product.sellingPrice;
      const finalUnitPrice = basePrice; // discount later here ,
      const itemTotal = finalUnitPrice * quantity;

      //find correct user cart
      let cart = await Cart.findOne({ user: userId }).populate( "appliedCoupon")

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

        //product exist in cart-> update quantity + itemTotal
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

      // await cart.populate("items.product").populate( "appliedCoupon")
      cart = await cart.populate('items.product')

      return { cart, warnings };
    } catch (error) {
      throw error;
    }
  }

  //REMOVE FROM CART
  static async removeFromCart(itemId, userId) {
    try {
        const warnings = []

      const cart = await Cart.findOneAndUpdate(
        { user: userId },
        { $pull: { items: { _id: itemId } } },
        {
          new: true,
        }
      ).populate("items.product").populate( "appliedCoupon")

      if (!cart) {
        throw new NotFoundError("Product not found", 404);
      }

      cart.totalQuantity = this.recalculateTotalQuantity(cart);
      cart.subTotal = this.recalculateSubTotal(cart);

      await this.revalidateAppliedCoupon(cart, warnings);

      await cart.save();
      return {cart};
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

      //products from DB stored in Map object for minimal queries,
      const productMap = new Map(products.map((p) => [p._id.toString(), p]));

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

          const basePrice = product.sellingPrice;
          const finalUnitPrice = basePrice; //after discount later
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

      const cart = await Cart.findOne({ user: userId }).populate( "appliedCoupon")

      if (!cart) throw new NotFoundError("Cart not found");

      cart.items = cartItems;

      //recalculate totals
      cart.totalQuantity = this.recalculateTotalQuantity(cart);
      cart.subTotal = this.recalculateSubTotal(cart);

      await this.revalidateAppliedCoupon(cart, warnings);

      await cart.save();

      // await cart.populate("items.product").populate( "appliedCoupon")

      return { cart, warnings };
    } catch (error) {
      throw error;
    }
  }

  //APPLY COUPON EXPLICITLY
  static applyCoupon = async (userId, code) => {
    const cart = await Cart.findOne({user: userId}).populate('items.product').populate( "appliedCoupon")

    if (!cart) throw new NotFoundError('Cart not found')
    
    const result = await CouponService.validateCoupon(
        code,
        cart.subTotal,
        cart.items
    )
    
    cart.appliedCoupon = result.coupon

    cart.discountTotal = Math.round(result.discount)
    cart.payableTotal = Math.round(result.finalAmount)


    
    
    await cart.save()
    await cart.populate('appliedCoupon')
    return {cart}
  }

  static removeCoupon = async (userId) => {
    const cart = await Cart.findOne({user: userId})
    if (!cart) throw new NotFoundError('Cart not found')
    
    cart.appliedCoupon = null
    cart.discountTotal = 0
    cart.payableTotal = cart.subTotal
    
    await cart.save()
    
    return {cart}
  }
}

module.exports = CartService;
