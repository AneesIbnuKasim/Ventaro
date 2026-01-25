const BannerService = require("../services/BannerService");
const BaseController = require("./baseController");

class BannerController extends BaseController {
  static createBanner = BaseController.asyncHandler(async (req, res) => {
    const { image, ...formData } = req.body;
    const banner = await BannerService.createBanner(
      req.file,
      formData
    );
    BaseController.logAction("CREATE-BANNER", "Banner created");
    BaseController.sendSuccess(res, "Banner created successfully", banner);
  });

  static fetchBanner = BaseController.asyncHandler(async (req, res) => {
    const banner = await BannerService.fetchBanner(req.query)
    BaseController.logAction("FETCH-BANNER", "Banner fetched")
    BaseController.sendSuccess(res, "Banner fetched successfully", banner)
  });

  static updateBanner = BaseController.asyncHandler(async (req, res) => {
    const { bannerId } = req.params
    const { image, ...formData } = req.body
    const updated = await BannerService.updateBanner(bannerId, formData, req.file)
    BaseController.sendSuccess(res, "Banner updated successfully", updated)
  })

    static deleteBanner = BaseController.asyncHandler(async (req, res) => {
    const banner = await BannerService.deleteBanner(req.params.bannerId)
    BaseController.logAction("FETCH-BANNER", "Banner deleted")
    BaseController.sendSuccess(res, "Banner deleted successfully", banner)
  });

    static toggleBannerStatus = BaseController.asyncHandler(async (req, res) => {
    const banner = await BannerService.toggleBannerStatus(req.params.bannerId)
    BaseController.logAction("TOGGLE-BANNER", "Banner deleted")
    BaseController.sendSuccess(res, "Banner status updated successfully", banner)
  });
}

module.exports = BannerController;
