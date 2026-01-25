const PaymentService = require("../services/paymentService");
const BaseController = require("./baseController");


 class PaymentController extends BaseController {

    static createRazorpayOrder = BaseController.asyncHandler(async(req, res) => {
        const data = await PaymentService.createRazorpayOrder(req.user._id, req.body)
        BaseController.logAction(res, 'RAZORPAY-ORDER', 'Razor pay payment order created')
        BaseController.sendSuccess(res, 'Razorpay payment order created successfully', data, 201)
    })

    static verifyRazorpayOrder = BaseController.asyncHandler(async(req, res) => {
        const data = await PaymentService.verifyRazorpayOrder(req.user._id, req.body)
        BaseController.logAction(res, 'RAZORPAY-VERIFICATION', 'Razor pay verification completed')
        BaseController.sendSuccess(res, 'Payment verified successfully', data, 200)
    })

    //COD-WALLET ORDER CREATION
    static createOrder = BaseController.asyncHandler(async(req, res) => {
        const data = await PaymentService.createOrder(req.user._id, req.body)
        BaseController.logAction(res, 'CREATE-ORDER', 'Order created')
        BaseController.sendSuccess(res, 'Order created', data, 201)
    })
}


module.exports = PaymentController