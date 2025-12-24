import mongoose, { mongo } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [],
    totalAmount: Number,

    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay"],
    },

    paymentInfo: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
    },

    paymentStatus: {
      type: String,
      enum: ["PAID", "PENDING", "FAILED"],
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

    paidAt: Date,
  },
  { timestamps: true }
);
orderSchema.index({ "paymentInfo.razorpayPaymentId": 1 });
export default mongoose.model("Order", orderSchema);
