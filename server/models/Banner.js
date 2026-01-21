const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema(
  {
    title: String,
    subTitle: String,
    image: 
  {
    url: { type: String, required: true },
    key: { type: String, required: true }
  }
,
    linkValue: String, // redirect URL
    linkType: {
      type: String,
      enum: ['category', 'product', 'filter', 'search'],
      required: true
    },
    position: {
      type: String,
      enum: ["HOME_TOP", "HOME_MIDDLE"],
      default: "HOME_TOP",
    },
    status: {
      type: String,
      default: 'active',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", BannerSchema);