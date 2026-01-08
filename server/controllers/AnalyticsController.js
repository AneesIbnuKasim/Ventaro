const { extend } = require("joi");
const BaseController = require("./baseController");
const AnalyticsService = require("../services/AnalyticsService");

class AnalyticsController extends BaseController {
    static fetchAnalytics = BaseController.asyncHandler(async(req, res) => {
        const salesReport = await AnalyticsService.fetchAnalytics(req.query)
        BaseController.logAction('SALES-REPORT', 'Sales report fetched successfully', salesReport)
        console.log('res in controller', salesReport);
        
        BaseController.sendSuccess(res, 'Sales report fetched successfully', salesReport, 200)
    })
}

module.exports = AnalyticsController