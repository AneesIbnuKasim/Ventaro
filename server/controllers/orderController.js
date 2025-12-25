const OrderService = require("../services/OrderService");
const BaseController = require("./baseController");

class OrderController extends BaseController {
    static fetchOrders = BaseController.asyncHandler(async(req, res)=>{
        const orders = await OrderService.fetchOrders(req.query)
        BaseController.logAction('FETCH-ORDERS',orders)
        BaseController.sendSuccess(res,'Orders fetched',orders)
    })

    static cancelOrder = BaseController.asyncHandler(async(req, res)=>{
        const order = await OrderService.cancelOrder(req.params.orderId)
        BaseController.logAction('CANCEL-ORDER',order)
        BaseController.sendSuccess(res,'Order cancelled',order, 200)
    })

    static returnOrderRequest = BaseController.asyncHandler(async(req, res)=>{
        const order = await OrderService.returnOrderRequest(req.params.orderId, req.body)
        BaseController.logAction('RETURN-ORDER',order)
        BaseController.sendSuccess(res,'Order return submitted',order, 200)
    })
    
}


module.exports = OrderController