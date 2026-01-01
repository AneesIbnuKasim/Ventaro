const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minlength: [2, "name must be at least 2 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: [8, "name must be at least 8 characters"],
    },
    brandName: {
      type: String,
      default: null,
    },
    //ACTUAL PRICE NOW
    sellingPrice: {
      type: Number,
      default: 0,
      required: true,
    },
    //MRP PRICE. mainly for ui strike
    originalPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "Active",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    // // variant: [
    // //     {
    // //         size: {
    // //             type: String,
    // //         },
    // //         stock: {
    // //             type: Number,
    // //             default: 0
    // //         }
    // //     }
    // ],
    // stock: {
    //     type: Number,
    //     required: true,
    //     min: 0
    // },
    images: {
      type: [String],
      required: true,
    },
    //PRODUCT RATING ADDED BY USERS
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        rating: { type: Number, min: 1, max: 5 },
        review: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    avgRating: {
      type: Number,
      default: 0
    },
    ratingCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", ProductSchema);
