const PaymentService = require("../services/paymentService");
const BaseController = require("./baseController");


 class PaymentController extends BaseController {
    static createRazorpayOrder = BaseController.asyncHandler(async(req, res) => {
        const result = await PaymentService.createRazorpayOrder(req.user._id, req.body)
    })
}


module.exports = PaymentController