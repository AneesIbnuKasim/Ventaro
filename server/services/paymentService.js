const Razorpay = require("razorpay");
const config = require("../config/config");
const Cart = require("../models/Cart");
const CouponService = require("./CouponService");
const { validateCouponCheckout } = require("./CouponService");
const logger = require("../utils/logger");
const { NotFoundError, ValidationError } = require("../utils/errors");

const razorpay = new Razorpay({
  key_id:config.RAZORPAY.API_KEY,
  key_secret:config.RAZORPAY.SECRET_KEY,
})

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

      console.log("cart ", cart);

      if (cart?.appliedCoupon?.code) {
        console.log('applied', cart.appliedCoupon);
        
        await CouponService.validateCouponCheckout(
        cart.appliedCoupon.code,
        cart.payableTotal,
        cart.items
      );
      }
      
      const grandTotal = this.calculatePayable(
        cart.payableTotal,
        paymentMethod
      );
      
      const razorpayOrder = await razorpay.orders.create({
        amount: grandTotal * 100,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
      })
      console.log('here verified', razorpayOrder);

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
      amount: grandTotal,
      currency: "INR",
      address: orderAddress
    };
    } catch (error) {
      console.log('error::', error);
      
      throw error;
    }
  }

  //RAZORPAY VERIFICATION AFTER PAYMENT
  static async verifyRazorpayOrder(userId, data) {
    try {
       const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      deliveryAddress
    } = data;

    if (!razorpay_order_id || razorpay_payment_id || razorpay_signature) throw new NotFoundError('Missing Razorpay details')

      //Create expected signature 
      const expectedSignature = crypto
      .createHmac('sha256', config.RAZORPAY.SECRET_KEY)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

      //compare signatures
      if (expectedSignature !== razorpay_signature) {
        throw new ValidationError('Payment verification failed')
      }

      //fetch cart again and create order
      const cart = await Cart.findOne({user: user._id})

      if (!cart || cart.items.length) throw new NotFoundError('Cart not found')
      
      const order = await Order.create({
        user: userId,
        items: cart.items,
        totalAmount: grandTotal,

      })
    } catch (error) {
      logger.error(error.message)
      throw error
    }
  }
}

module.exports = PaymentService;
