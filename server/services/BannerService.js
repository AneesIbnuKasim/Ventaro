const Banner = require("../models/Banner");

class BannerService {
  static createBanner = async (image, formData) => {
    console.log('data', image);
    
    try {
      const banner = new Banner({
        ...formData,
        image: `/uploads/${image}`
      });
      await banner.save();
      return banner;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = BannerService;
