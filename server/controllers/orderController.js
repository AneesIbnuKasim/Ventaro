const OrderService = require("../services/OrderService");
const BaseController = require("./baseController");

class OrderController extends BaseController {
    static fetchOrders = BaseController.asyncHandler(async(req, res)=>{
        const orders = await OrderService.fetchOrders(req?.user?._id, req.query)
        BaseController.logAction('FETCH-ORDERS',orders)
        BaseController.sendSuccess(res,'Orders fetched',orders)
    })

    static fetchOrderById = BaseController.asyncHandler(async(req, res)=>{
        const order = await OrderService.fetchOrderById(req.params.orderId)
        BaseController.logAction('FETCH-ORDER',order)
        BaseController.sendSuccess(res,'Orders fetched',order)
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

    // ADMIN ACTION CONTROLLERS

    static updateStatus = BaseController.asyncHandler(async(req, res)=>{
        const order = await OrderService.updateStatus(req.params.orderId, req.body)
        BaseController.logAction('RETURN-ORDER',order)
        BaseController.sendSuccess(res,'Order status changed',order, 200)
    })
    
}


module.exports = OrderController