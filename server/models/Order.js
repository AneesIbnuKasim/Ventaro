import mongoose, { mongo } from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true
    },
    quantity: Number,
    basePrice: Number,
    finalUnitPrice: Number,
    itemTotal: Number
  }
],
    totalAmount: Number,

    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay", "Wallet"],
    },

    paymentInfo: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
    },

    paymentStatus: {
      type: String,
      enum: ["PAID", "PENDING", "FAILED", "REFUND_INITIATED", "REFUNDED"],
    },
    orderStatus: {
      type: String,
      enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURN_INITIATED","RETURNED", ],
      default: "PENDING"
    },

    deliveryAddress: {
      name: String,
      phone: String,
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
      label: String,
    },
    cancelledAt: Date,
    deliveredAt: Date,
    paidAt: Date,
    returnInfo: {
      reason: String,
      note: String,
      date: Date
    }
  },
  { timestamps: true }
);
orderSchema.index({ "paymentInfo.razorpayPaymentId": 1 });
export default mongoose.model("Order", orderSchema);
