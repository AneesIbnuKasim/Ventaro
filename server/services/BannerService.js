const config = require("../config/config");
const Banner = require("../models/Banner");
const { NotFoundError } = require("../utils/errors");
const logger = require("../utils/logger");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { s3 } = require("../config/multer.js");

class BannerService {
  static createBanner = async (file, formData) => {
    try {
      const banner = new Banner({
        ...formData,
        image: {
          url: file.location || `/uploads/${file.filename}`,
          key: file.key || file.filename,
        },
      });
      await banner.save();
      return banner;
    } catch (error) {
      throw error;
    }
  };

  //UPDATE BANNER
  static async updateBanner(bannerId, data, file) {
    try {
      const updateData = { ...data };

      if (image) {
        updateData.image = {
          url: file.location || `/uploads/${file.filename}`,
          key: file.key || file.filename,
        };
      }

      const updated = await Banner.findByIdAndUpdate(bannerId, updateData, {
        new: true,
      });

      return updated;
    } catch (error) {
      throw error;
    }
  }

  //FETCH BANNERS
  static fetchBanner = async (data) => {
    console.log("search", data);
    const { search = "" } = data;
    try {
      const filter = {};
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { subTitle: { $regex: search, $options: "i" } },
      ];
      const banner = await Banner.find(filter);
      return banner;
    } catch (error) {
      throw error;
    }
  };

  //DELETE BANNER
  static deleteBanner = async (bannerId) => {
    try {
      const banner = await Banner.findByIdAndDelete(bannerId);
      //delete image from s3 in prod
      if (config.NODE_ENV === "production") {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: config.AWS.BUCKET_NAME,
            Key: banner.image?.key,
          })
        );
      }
      return banner;
    } catch (error) {
      throw error;
    }
  };

  //TOGGLE BANNER STATUS
  static toggleBannerStatus = async (bannerId) => {
    try {
      const banner = await Banner.findById(bannerId);
      if (!banner) return new NotFoundError("Banner not found");
      banner.status = banner.status === "active" ? "inactive" : "active";
      await banner.save();
      return banner;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = BannerService;
