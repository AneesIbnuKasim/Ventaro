const Banner = require("../models/Banner");
const { NotFoundError } = require("../utils/errors");
const logger = require("../utils/logger");

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

  //UPDATE BANNER
  static async updateBanner(bannerId, data, image) {
  try {
    const updateData = { ...data }

    console.log('image in service', image)

  if (image) {
    updateData.image = `/uploads/${image}`
  }

  const updated = await Banner.findByIdAndUpdate(
    bannerId,
    updateData,
    { new: true }
  )

  return updated
  } catch (error) {
    throw error
  }
}

  //FETCH BANNERS
  static fetchBanner = async (data) => {
    try {
      const banner = await Banner.find()
      return banner;
    } catch (error) {
      throw error;
    }
  };

  //DELETE BANNER
  static deleteBanner = async (bannerId) => {
    try {
      const banner = await Banner.findByIdAndDelete(bannerId)
      return banner;
    } catch (error) {
      throw error;
    }
  };

  //TOGGLE BANNER STATUS
  static toggleBannerStatus = async (bannerId) => {
    try {
      const banner = await Banner.findById(bannerId)
      if (!banner) return new NotFoundError('Banner not found')
      banner.status = banner.status === 'active' ? 'inactive' : 'active'
    
    await banner.save()
    console.log('BANN',banner.status);
      return banner;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = BannerService;
