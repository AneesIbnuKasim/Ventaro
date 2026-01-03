const Razorpay = require("razorpay");
const crypto = require("crypto");
const config = require("../config/config");
const Cart = require("../models/Cart");
const CouponService = require("./CouponService");
const logger = require("../utils/logger");
const { NotFoundError, ValidationError, AuthenticationError } = require("../utils/errors");
const { default: Order } = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const { default: mongoose } = require("mongoose");

const razorpay = new Razorpay({
  key_id: config.RAZORPAY.API_KEY,
  key_secret: config.RAZORPAY.SECRET_KEY,
});

class PaymentService {
  static calculateGrandTotal(payableTotal, paymentMethod) {
    const deliveryFee =
      payableTotal > config.FREE_SHIPPING_THRESHOLD ? 0 : config.DELIVERY_FEE;
    const codFee = paymentMethod === "COD" ? config.COD_FEE : 0;

    return (payableTotal + deliveryFee + codFee);
  }

  //CALCULATE TOTALS

  static calculatePayableTotal = (subTotal, discountTotal) => {
     return Math.max(0, subTotal - discountTotal ?? 0);
  }
  static calculateSubTotal(items) {
  const subTotal = items.reduce(
    (sum, item) => sum + item.finalUnitPrice * item.quantity,
    0
  );

  return subTotal;
}

//CREATE RAZORPAY ORDER
  static async createRazorpayOrder(userId, data) {
    try {
      const { paymentMethod, mode='cart',  buyNowItems=[]} = data;

      console.log('buynoeitems', buyNowItems);
      console.log('buynow mode', mode);
      

      let items = [];
    let appliedCoupon = null;
    let cartDoc = null;

    /* ---------------- RESOLVE ITEMS ---------------- */
    if (mode === "cart") {
      cartDoc = await Cart.findOne({ user: userId }).populate("items.product").populate('appliedCoupon');
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
    const subTotal =
      this.calculateSubTotal(items);

      let discountTotal = 0
    /* ---------------- COUPON VALIDATION ---------------- */
    if (appliedCoupon?.code) {
      const result = await CouponService.validateCoupon(
        appliedCoupon.code,
        subTotal,
        items
      );
      discountTotal = result.discount
    }

    const payableTotal = this.calculatePayableTotal(subTotal, discountTotal)

    const grandTotal = this.calculateGrandTotal(
      payableTotal,
      paymentMethod
    );

console.log('in razorpay GrandTotal:', grandTotal);


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
    const session = await mongoose.startSession()
    try {
      
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        grandTotal,
        deliveryAddress,
        mode = 'cart',
        buyNowItems = [], 
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

    let items = [];
    let appliedCoupon = null;
    let cartDoc = null;

    /* ---------------- RESOLVE ITEMS ---------------- */
    if (mode === "cart") {
      cartDoc = await Cart.findOne({ user: userId }).populate("items.product").populate('appliedCoupon')
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
    const subTotal =
      this.calculateSubTotal(items);

      let discountTotal = 0
    /* ---------------- COUPON VALIDATION ---------------- */
    if (appliedCoupon?.code) {
      const result = await CouponService.validateCoupon(
        appliedCoupon.code,
        subTotal,
        items
      );
      discountTotal = result.discount
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
          {_id: item.product._id},
          {$inc: {stock: -item.quantity}}
        )
      }
//Generate random orderId
      const idFormat = Array.from({ length: 4 }, () =>
  crypto.getRandomValues(new Uint16Array(1))[0]
    .toString(16)
    .padStart(4, '0')
).join('-');

      const order = await Order.create({
        orderId: `ORDER-${idFormat}` ,
        user: userId,
        items:[ ...items],
        totalAmount: grandTotal,
        totalDiscount: discountTotal,
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
      buyNowItems = []
    } = data;
console.log('items:', buyNowItems);

    let items = [];
    let appliedCoupon = null;
    let cartDoc = null;

    /* ---------------- RESOLVE ITEMS ---------------- */
    if (mode === "cart") {
      cartDoc = await Cart.findOne({ user: userId }).populate("items.product").populate('appliedCoupon')
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

    console.log('applied coupon', appliedCoupon);

    
    const  subTotal  =
    this.calculateSubTotal(items, appliedCoupon);
    
    let discountTotal = 0
    // let payableTotal
    /* ---------------- COUPON VALIDATION ---------------- */
    if (appliedCoupon?.code) {
      const result = await CouponService.validateCoupon(
        appliedCoupon.code,
        subTotal,
        items
      );
      discountTotal = result.discount
    }
    
    /* ---------------- CALCULATE TOTALS ---------------- */
    
    const payableTotal = this.calculatePayableTotal(subTotal, discountTotal)



    const grandTotal = this.calculateGrandTotal(
      payableTotal,
      paymentMethod
    );

    console.log('grand total', grandTotal)
    

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
console.log('discount total:', discountTotal);

    /* ---------------- ORDER ID ---------------- */
          const idFormat = Array.from({ length: 4 }, () =>
  crypto.getRandomValues(new Uint16Array(1))[0]
    .toString(16)
    .padStart(4, '0')
).join('-');

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









// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// const config = require("../config/config");
// const Cart = require("../models/Cart");
// const CouponService = require("./CouponService");
// const logger = require("../utils/logger");
// const { NotFoundError, ValidationError, AuthenticationError } = require("../utils/errors");
// const { default: Order } = require("../models/Order");
// const User = require("../models/User");
// const Product = require("../models/Product");
// const { default: mongoose } = require("mongoose");

// const razorpay = new Razorpay({
//   key_id: config.RAZORPAY.API_KEY,
//   key_secret: config.RAZORPAY.SECRET_KEY,
// });

// class PaymentService {
//   static calculatePayable(cartTotal, paymentMethod) {
//     const deliveryFee =
//       cartTotal > config.FREE_SHIPPING_THRESHOLD ? 0 : config.DELIVERY_FEE;
//     const codFee = paymentMethod === "COD" ? config.COD_FEE : 0;

//     return (cartTotal + deliveryFee + codFee);
//   }
//   static async createRazorpayOrder(userId, data) {
//     try {
//       const { paymentMethod } = data;
//       const cart = await Cart.findOne({ user: userId });

//       if (!cart || !cart.items.length) {
//         throw new Error("Cart is empty");
//       }

//       console.log("cart ", cart);

//       if (cart?.appliedCoupon?.code) {
//         console.log("applied", cart.appliedCoupon);

//         await CouponService.validateCouponCheckout(
//           cart.appliedCoupon.code,
//           cart.payableTotal,
//           cart.items
//         );
//       }

//       const grandTotal = this.calculatePayable(
//         cart.payableTotal,
//         paymentMethod
//       );

//       const razorpayOrder = await razorpay.orders.create({
//         amount: grandTotal * 100,
//         currency: "INR",
//         receipt: `rcpt_${Date.now()}`,
//       });
//       console.log("here verified", razorpayOrder);

//       return {
//         razorpayOrderId: razorpayOrder.id,
//         amount: grandTotal,
//         currency: "INR",
//       };
//     } catch (error) {
//       console.log("error::", error);

//       throw error;
//     }
//   }

//   //RAZORPAY VERIFICATION AFTER PAYMENT
//   static async verifyRazorpayOrder(userId, data) {
//     const session = await mongoose.startSession()
//     try {
      
//       const {
//         razorpay_order_id,
//         razorpay_payment_id,
//         razorpay_signature,
//         deliveryAddress,
//       } = data;

//       console.log("dataa at verify server", data);

//       if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
//         throw new NotFoundError("Missing Razorpay details");

//       //Create expected signature
//       const expectedSignature = crypto
//         .createHmac("sha256", config.RAZORPAY.SECRET_KEY)
//         .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//         .digest("hex");

//       //compare signatures
//       if (expectedSignature !== razorpay_signature) {
//         throw new ValidationError("Payment verification failed");
//       }

//       console.log("userId", userId);

//       //fetch cart again and create order
//       const cart = await Cart.findOne({ user: userId });

//       if (!cart || !cart.items.length)
//         throw new NotFoundError("Cart not found");

//       const grandTotal = this.calculatePayable(cart.payableTotal, "razorpay");

//       //CLEAN ADDRESS
//       const orderAddress = {
//         name: deliveryAddress.fullName,
//         phone: deliveryAddress.phone,
//         addressLine: deliveryAddress.addressLine,
//         city: deliveryAddress.city,
//         state: deliveryAddress.state,
//         pincode: deliveryAddress.pinCode,
//         label: deliveryAddress.label,
//       };

//       for (const item of cart.items) {
//         await Product.updateOne(
//           {_id: item.product._id},
//           {$inc: {stock: -item.quantity}}
//         )
//       }
// //Generate random orderId
//       const idFormat = Array.from({ length: 4 }, () =>
//   crypto.getRandomValues(new Uint16Array(1))[0]
//     .toString(16)
//     .padStart(4, '0')
// ).join('-');

//       const order = await Order.create({
//         orderId: `ORDER-${idFormat}` ,
//         user: userId,
//         items:[ ...cart.items],
//         totalAmount: grandTotal,
//         paymentMethod: "Razorpay",
//         paymentStatus: "PAID",
//         paymentInfo: {
//           razorpayOrderId: razorpay_order_id,
//           razorpay_payment_id: razorpay_payment_id,
//           razorpaySignature: razorpay_signature,
//         },
//         deliveryAddress,
//         paidAt: Date.now(),
//       });

//       cart.items = [];
//       cart.appliedCoupon = null;
//       cart.discountTotal = 0;
//       cart.payableTotal = 0;
//       cart.totalQuantity = 0;
//       cart.subTotal = 0;
//       await cart.save();

//       return {
//         success: true,
//         orderId: order._id,
//       };
//     } catch (error) {
//       logger.error(error.message);
//       throw error;
//     }
//   }
  
//   //CREATE ORDER COD/WALLET
//   static async createOrder(userId, data) {
    
//     try {
//       const { paymentMethod, deliveryAddress } = data;
//       console.log('cod data', data);
      
//       const cart = await Cart.findOne({ user: userId });

//       if (!cart || !cart.items.length) {
//         throw new Error("Cart is empty");
//       }

//       console.log("cart ", cart);

//       if (cart?.appliedCoupon?.code) {
//         console.log("applied", cart.appliedCoupon);

//         await CouponService.validateCouponCheckout(
//           cart.appliedCoupon.code,
//           cart.payableTotal,
//           cart.items
//         );
//       }

//       const grandTotal = this.calculatePayable(
//         cart.payableTotal,
//         paymentMethod
//       );

//       //CLEAN ADDRESS
//       const orderAddress = {
//         name: deliveryAddress.fullName,
//         phone: deliveryAddress.phone,
//         addressLine: deliveryAddress.addressLine,
//         city: deliveryAddress.city,
//         state: deliveryAddress.state,
//         pincode: deliveryAddress.pinCode,
//         label: deliveryAddress.label,
//       };

      

//       if (paymentMethod === 'Wallet') {
//         const user = await User.findById(userId)

//         if (!user) throw new NotFoundError('User not found')
        
//         if (user.wallet.balance < grandTotal) throw new ValidationError('Not enough wallet balance...')
//         user.wallet.balance -= grandTotal

//         await user.save()
//       }

//       for (const item of cart.items) {
//         await Product.updateOne(
//           {_id: item.product._id},
//           {$inc: {stock: -item.quantity}}
//         )
//       }

//       //generate random orderId
//       const orderId = Array.from({ length: 4 }, () =>
//   crypto.getRandomValues(new Uint16Array(1))[0]
//     .toString(16)
//     .padStart(4, '0')
// ).join('-');

//       const order = await Order.create({
//         orderId,
//         user: userId,
//         items:[ ...cart.items],
//         totalAmount: grandTotal,
//         totalDiscount: cart.discountTotal,
//         paymentMethod: paymentMethod,
//         paymentStatus: paymentMethod === 'Wallet' ? config.PAYMENT_STATUS.PAID : config.PAYMENT_STATUS.PENDING,
//         deliveryAddress: orderAddress
//       });

//       cart.items = [];
//       cart.appliedCoupon = null;
//       cart.discountTotal = 0;
//       cart.payableTotal = 0;
//       cart.totalQuantity = 0;
//       cart.subTotal = 0;
//       await cart.save();

//       return {
//         success: true,
//         orderId: order._id,
//       };

//     } catch (error) {
//       console.log("error::", error);

//       throw error;
//     }
//   }
  
// }

// module.exports = PaymentService;
