import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [],
  totalAmount: Number,

  paymentMethod: {
    type: String,
    enum: ["COD", "Razorpay"]
  },

  paymentInfo: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String
  },

  isPaid: {
    type: Boolean,
    default: false
  },

  paidAt: Date
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);