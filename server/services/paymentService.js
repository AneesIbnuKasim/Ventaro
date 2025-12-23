const config = require("../config/config");
const Cart = require("../models/Cart");
const CouponService = require("./CouponService");
const { validateCouponCheckout } = require("./CouponService");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

class PaymentService {
  static calculatePayable(cartTotal, paymentMethod) {
    const deliveryFee =
      cartTotal < config.FREE_SHIPPING_THRESHOLD ? config.DELIVERY_FEE : 0;
    const codFee = paymentMethod === "cod" ? config.COD_FEE : 0;

    return cartTotal + deliveryFee + codFee;
  }
  static async createRazorpayOrder(userId, data) {
    try {
      const { paymentMethod, deliveryAddress } = data;
      const cart = await Cart.findOne({ user: userId });
      delete deliveryAddress.userId;
      delete deliveryAddress.isDefault;

      if (!cart || !cart.items.length) {
        throw new Error("Cart is empty");
      }

      console.log("cart", cart);

      if (cart.appliedCoupon) {
        await CouponService.validateCouponCheckout(
        cart.appliedCoupon.code,
        cart.grandTotal,
        cart.items
      );
      }

      const payableTotal = this.calculatePayable(
        cart.grandTotal,
        paymentMethod
      );

      const razorpayOrder = await razorpay.orders.create({
        amount: payableTotal * 100,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
      })

      //CLEAN ADDRESS 
          const orderAddress = {
      name: deliveryAddress.fullName,
      phone: deliveryAddress.phone,
      addressLine: deliveryAddress.addressLine,
      city: deliveryAddress.city,
      state: deliveryAddress.state,
      pincode: deliveryAddress.pinCode,
      label: deliveryAddress.label
    };
        return {
      razorpayOrderId: razorpayOrder.id,
      amount: payableTotal,
      currency: "INR",
      address: orderAddress
    };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PaymentService;
