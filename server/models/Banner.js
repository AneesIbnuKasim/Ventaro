const mongoose = require("mongoose");

const BannerSchema = new mongoose.Schema(
  {
    title: String,
    subtitle: String,
    image: {
      type: String,
      required: true,
    },
    urlLink: String, // redirect URL
    position: {
      type: String,
      enum: ["HOME_TOP", "HOME_MIDDLE"],
      default: "HOME_TOP",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", BannerSchema);