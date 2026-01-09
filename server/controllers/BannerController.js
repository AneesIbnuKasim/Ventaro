const BannerService = require("../services/BannerService");
const BaseController = require("./baseController");

class BannerController extends BaseController {
    static createBanner = BaseController.asyncHandler(async(req, res) => {
        console.log('data in controller', req.body)
        const {image, ...formData} = req.body
        console.log('file in controller', )
        
        const banner = await BannerService.createBanner(req.file.filename, formData)
        BaseController.logAction('CREATE-BANNER', 'Banner created')
        BaseController.sendSuccess(res, 'Banner created successfully', banner)

    })

    static fetchBanner = BaseController.asyncHandler(async(req, res) => {
        const banner = await BannerService.fetchBanner(req.body)
        BaseController.logAction('FETCH-BANNER', 'Banner fetched')
        BaseController.sendSuccess(res, 'Banner fetched successfully', banner)

    })
}

module.exports = BannerController