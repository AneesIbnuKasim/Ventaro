const Razorpay = require("razorpay");
const crypto = require("crypto");
const config = require("../config/config");
const Cart = require("../models/Cart");
const CouponService = require("./CouponService");
const logger = require("../utils/logger");
const { NotFoundError, ValidationError, AuthenticationError } = require("../utils/errors");
const { default: Order } = require("../models/Order");
const User = require("../models/User");

const razorpay = new Razorpay({
  key_id: config.RAZORPAY.API_KEY,
  key_secret: config.RAZORPAY.SECRET_KEY,
});

class PaymentService {
  static calculatePayable(cartTotal, paymentMethod) {
    const deliveryFee =
      cartTotal > config.FREE_SHIPPING_THRESHOLD ? 0 : config.DELIVERY_FEE;
    const codFee = paymentMethod === "COD" ? config.COD_FEE : 0;

    return cartTotal + deliveryFee + codFee;
  }
  static async createRazorpayOrder(userId, data) {
    try {
      const { paymentMethod } = data;
      const cart = await Cart.findOne({ user: userId });

      if (!cart || !cart.items.length) {
        throw new Error("Cart is empty");
      }

      console.log("cart ", cart);

      if (cart?.appliedCoupon?.code) {
        console.log("applied", cart.appliedCoupon);

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
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
      });
      console.log("here verified", razorpayOrder);

      return {
        razorpayOrderId: razorpayOrder.id,
        amount: grandTotal,
        currency: "INR",
      };
    } catch (error) {
      console.log("error::", error);

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
        deliveryAddress,
      } = data;

      console.log("dataa at verify server", data);

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
        throw new NotFoundError("Missing Razorpay details");

      //Create expected signature
      const expectedSignature = crypto
        .createHmac("sha256", config.RAZORPAY.SECRET_KEY)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      //compare signatures
      if (expectedSignature !== razorpay_signature) {
        throw new ValidationError("Payment verification failed");
      }

      console.log("userId", userId);

      //fetch cart again and create order
      const cart = await Cart.findOne({ user: userId });

      if (!cart || !cart.items.length)
        throw new NotFoundError("Cart not found");

      const grandTotal = this.calculatePayable(cart.payableTotal, "razorpay");

      //CLEAN ADDRESS
      const orderAddress = {
        name: deliveryAddress.fullName,
        phone: deliveryAddress.phone,
        addressLine: deliveryAddress.addressLine,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        pincode: deliveryAddress.pinCode,
        label: deliveryAddress.label,
      };

      const order = await Order.create({
        user: userId,
        items:[ ...cart.items],
        totalAmount: grandTotal,
        paymentMethod: "Razorpay",
        paymentStatus: "PAID",
        paymentInfo: {
          razorpayOrderId: razorpay_order_id,
          razorpay_payment_id: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
        deliveryAddress,
        paidAt: Date.now(),
      });

      cart.items = [];
      cart.appliedCoupon = null;
      cart.discountTotal = 0;
      cart.payableTotal = 0;
      cart.totalQuantity = 0;
      cart.subTotal = 0;
      await cart.save();

      return {
        success: true,
        orderId: order._id,
      };
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }
  
  //CREATE ORDER COD/WALLET
  static async createOrder(userId, data) {
    try {
      const { paymentMethod, deliveryAddress } = data;
      console.log('cod data', data);
      
      const cart = await Cart.findOne({ user: userId });

      if (!cart || !cart.items.length) {
        throw new Error("Cart is empty");
      }

      console.log("cart ", cart);

      if (cart?.appliedCoupon?.code) {
        console.log("applied", cart.appliedCoupon);

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

      //CLEAN ADDRESS
      const orderAddress = {
        name: deliveryAddress.fullName,
        phone: deliveryAddress.phone,
        addressLine: deliveryAddress.addressLine,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        pincode: deliveryAddress.pinCode,
        label: deliveryAddress.label,
      };

      

      if (paymentMethod === 'Wallet') {
        const user = await User.findById(userId)

        if (!user) throw new NotFoundError('User not found')
        
        if (user.wallet.balance < grandTotal) throw new ValidationError('Not enough wallet balance...')
        user.wallet.balance -= grandTotal

        await user.save()
      }

      const order = await Order.create({
        user: userId,
        items:[ ...cart.items],
        totalAmount: grandTotal,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'Wallet' ? config.PAYMENT_STATUS.PAID : config.PAYMENT_STATUS.PENDING,
        deliveryAddress: orderAddress
      });

      cart.items = [];
      cart.appliedCoupon = null;
      cart.discountTotal = 0;
      cart.payableTotal = 0;
      cart.totalQuantity = 0;
      cart.subTotal = 0;
      await cart.save();

      return {
        success: true,
        orderId: order._id,
      };

    } catch (error) {
      console.log("error::", error);

      throw error;
    }
  }
  
}

module.exports = PaymentService;
