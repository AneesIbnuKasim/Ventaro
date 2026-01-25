const Razorpay = require("razorpay");
const crypto = require("crypto");
const config = require("../config/config");
const Cart = require("../models/Cart");
const CouponService = require("./CouponService");
const logger = require("../utils/logger");
const {
  NotFoundError,
  ValidationError,
  AuthenticationError,
} = require("../utils/errors");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const { default: mongoose } = require("mongoose");

const razorpay = new Razorpay({
  key_id: config.RAZORPAY.API_KEY,
  key_secret: config.RAZORPAY.SECRET_KEY,
});

class PaymentService {
  //CALCULATE TOTALS

  static calculatePayableTotal = (subTotal, discountTotal) => {
    return Math.max(0, subTotal - discountTotal ?? 0);
  };
  static calculateSubTotal(items) {
    const subTotal = items.reduce(
      (sum, item) => sum + item.finalUnitPrice * item.quantity,
      0
    );

    return subTotal;
  }

  static calculateGrandTotal(payableTotal, paymentMethod) {
    const deliveryFee =
      payableTotal > config.FREE_SHIPPING_THRESHOLD ? 0 : config.DELIVERY_FEE;
    const codFee = paymentMethod === "COD" ? config.COD_FEE : 0;

    return payableTotal + deliveryFee + codFee;
  }

  //CREATE RAZORPAY ORDER
  static async createRazorpayOrder(userId, data) {
    try {
      const { paymentMethod, mode = "cart", buyNowItems = [] } = data;

      let items = [];
      let appliedCoupon = null;
      let cartDoc = null;

      /* ---------------- RESOLVE ITEMS ---------------- */
      if (mode === "cart") {
        cartDoc = await Cart.findOne({ user: userId })
          .populate("items.product")
          .populate("appliedCoupon");
        if (!cartDoc || cartDoc.items.length === 0) {
          throw new ValidationError("Cart is empty");
        }
        items = cartDoc.items;
        appliedCoupon = cartDoc.appliedCoupon;
      }

      if (mode === "buynow") {
        if (!buyNowItems.length) {
          throw new ValidationError("Buy now items missing");
        }
        items = buyNowItems;
      }

      /* ---------------- CALCULATE TOTALS ---------------- */
      const subTotal = this.calculateSubTotal(items);

      let discountTotal = 0;
      /* ---------------- COUPON VALIDATION ---------------- */
      if (appliedCoupon?.code) {
        const result = await CouponService.validateCoupon(
          appliedCoupon.code,
          subTotal,
          items
        );
        discountTotal = result.discount;
      }

      const payableTotal = this.calculatePayableTotal(subTotal, discountTotal);

      const grandTotal = this.calculateGrandTotal(payableTotal, paymentMethod);

      const razorpayOrder = await razorpay.orders.create({
        amount: grandTotal * 100,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
      });

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
    const session = await mongoose.startSession();
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        grandTotal,
        deliveryAddress,
        mode = "cart",
        buyNowItems = [],
      } = data;

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

      let items = [];
      let appliedCoupon = null;
      let cartDoc = null;

      /* ---------------- RESOLVE ITEMS ---------------- */
      if (mode === "cart") {
        cartDoc = await Cart.findOne({ user: userId })
          .populate("items.product")
          .populate("appliedCoupon");
        if (!cartDoc || cartDoc.items.length === 0) {
          throw new ValidationError("Cart is empty");
        }
        items = cartDoc.items;
        appliedCoupon = cartDoc.appliedCoupon;
      }

      //buyNowItems
      if (mode === "buynow") {
        if (!buyNowItems.length) {
          throw new ValidationError("Buy now items missing");
        }
        items = buyNowItems;
      }

      // /* ---------------- CALCULATE TOTALS ---------------- */
      const subTotal = this.calculateSubTotal(items);

      let discountTotal = 0;
      /* ---------------- COUPON VALIDATION ---------------- */
      if (appliedCoupon?.code) {
        const result = await CouponService.validateCoupon(
          appliedCoupon.code,
          subTotal,
          items
        );
        discountTotal = result.discount;
      }

      // const payableTotal = this.calculatePayableTotal(subTotal, discountTotal)

      // const grandTotal = this.calculateGrandTotal(
      //   payableTotal,
      //   paymentMethod = 'Razorpay'
      // );

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

      for (const item of items) {
        await Product.updateOne(
          { _id: item.product._id },
          { $inc: { stock: -item.quantity } }
        );
      }
      //Generate random orderId
      const idFormat = Array.from({ length: 4 }, () =>
        crypto
          .getRandomValues(new Uint16Array(1))[0]
          .toString(16)
          .padStart(4, "0")
      ).join("-");

      const order = await Order.create({
        orderId: `ORDER-${idFormat}`,
        user: userId,
        items: [...items],
        totalAmount: grandTotal,
        totalDiscount: discountTotal,
        paymentMethod: "Razorpay",
        paymentStatus: "PAID",
        paymentInfo: {
          razorpayOrderId: razorpay_order_id,
          razorpay_payment_id: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
        },
        deliveryAddress: orderAddress,
        paidAt: Date.now(),
      });

      /* ---------------- CLEAR CART ---------------- */
      if (mode === "cart") {
        cartDoc.items = [];
        cartDoc.appliedCoupon = null;
        await cartDoc.save();
      }

      return {
        success: true,
        orderId: order.orderId,
      };
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }

  //CREATE ORDER COD/WALLET
  static async createOrder(userId, data) {
    try {
      const {
        paymentMethod,
        deliveryAddress,
        mode = "cart",
        buyNowItems = [],
      } = data;

      let items = [];
      let appliedCoupon = null;
      let cartDoc = null;

      /* ---------------- RESOLVE ITEMS ---------------- */
      if (mode === "cart") {
        cartDoc = await Cart.findOne({ user: userId })
          .populate("items.product")
          .populate("appliedCoupon");
        if (!cartDoc || cartDoc.items.length === 0) {
          throw new ValidationError("Cart is empty");
        }
        items = cartDoc.items;
        appliedCoupon = cartDoc.appliedCoupon;
      }

      if (mode === "buynow") {
        if (!buyNowItems.length) {
          throw new ValidationError("Buy now items missing");
        }
        items = buyNowItems;
      }

      const subTotal = this.calculateSubTotal(items, appliedCoupon);

      let discountTotal = 0;
      // let payableTotal
      /* ---------------- COUPON VALIDATION ---------------- */
      if (appliedCoupon?.code) {
        const result = await CouponService.validateCoupon(
          appliedCoupon.code,
          subTotal,
          items
        );
        discountTotal = result.discount;
      }

      /* ---------------- CALCULATE TOTALS ---------------- */

      const payableTotal = this.calculatePayableTotal(subTotal, discountTotal);

      const grandTotal = this.calculateGrandTotal(payableTotal, paymentMethod);

      /* ---------------- ADDRESS ---------------- */
      const orderAddress = {
        name: deliveryAddress.fullName,
        phone: deliveryAddress.phone,
        addressLine: deliveryAddress.addressLine,
        city: deliveryAddress.city,
        state: deliveryAddress.state,
        pincode: deliveryAddress.pinCode,
        label: deliveryAddress.label,
      };

      /* ---------------- WALLET ---------------- */
      if (paymentMethod === "Wallet") {
        const user = await User.findById(userId);
        if (!user) throw new NotFoundError("User not found");
        if (user.wallet.balance < grandTotal) {
          throw new ValidationError("Insufficient wallet balance");
        }
        user.wallet.balance -= grandTotal;
        await user.save();
      }

      /* ---------------- STOCK ---------------- */
      for (const item of items) {
        await Product.updateOne(
          { _id: item.product._id },
          { $inc: { stock: -item.quantity } }
        );
      }
      /* ---------------- ORDER ID ---------------- */
      const idFormat = Array.from({ length: 4 }, () =>
        crypto
          .getRandomValues(new Uint16Array(1))[0]
          .toString(16)
          .padStart(4, "0")
      ).join("-");

      /* ---------------- CREATE ORDER ---------------- */
      const order = await Order.create({
        orderId: `ORDER-${idFormat}`,
        user: userId,
        items,
        totalAmount: grandTotal,
        totalDiscount: discountTotal,
        paymentMethod,
        paymentStatus:
          paymentMethod === "Wallet"
            ? config.PAYMENT_STATUS.PAID
            : config.PAYMENT_STATUS.PENDING,
        deliveryAddress: orderAddress,
      });

      /* ---------------- CLEAR CART ---------------- */
      if (mode === "cart") {
        cartDoc.items = [];
        cartDoc.appliedCoupon = null;
        await cartDoc.save();
      }

      return {
        success: true,
        orderId: order._id,
      };
    } catch (error) {
      console.error("create order error:", error);
      throw error;
    }
  }
}

module.exports = PaymentService;