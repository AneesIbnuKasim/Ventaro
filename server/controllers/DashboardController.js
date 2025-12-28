const { extend } = require("joi");
const BaseController = require("./baseController");
const DashboardService = require("../services/DashboardService");

class DashboardController extends BaseController {
    static fetchSalesReport = BaseController.asyncHandler(async(req, res) => {
        const salesReport = await DashboardService.fetchSalesReport(req.query)
        BaseController.logAction('SALES-REPORT', 'Sales report fetched successfully', salesReport)
        console.log('res in controller', salesReport);
        
        BaseController.sendSuccess(res, 'Sales report fetched successfully', salesReport, 200)
    })
}

module.exports = DashboardController