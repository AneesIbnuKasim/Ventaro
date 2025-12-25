const { ORDER_STATUS, PAYMENT_STATUS } = require("../config/config");
const { findById } = require("../models/Coupon");
const { default: Order } = require("../models/Order");
const User = require("../models/User");
const { NotFoundError, AuthenticationError } = require("../utils/errors");

class OrderService {
    static async fetchOrders() {
        try {
            const orders = await Order.find().populate('items.product').sort({createdAt:-1})
            console.log('orderrrrras', orders);
            
            return {orders}
        } catch (error) {
            throw error
        }
    }

    //CANCEL AN ORDER
    static async cancelOrder(orderId) {
        try {
            console.log('cancel orderId', orderId);
            
            const order = await Order.findById(orderId).populate('items.product')
            console.log('orderrrrras', order);
            
            if (!order) throw new NotFoundError('Order not found')
            
            if (order.orderStatus === (ORDER_STATUS.SHIPPED || ORDER_STATUS.DELIVERED) ) {
                throw new AuthenticationError('Order cannot be cancelled now.')
            }

            if (order.orderStatus === ORDER_STATUS.CANCELLED) {
                throw new AuthenticationError('Order already cancelled.')
            }

            if (order.orderStatus === ORDER_STATUS.RETURNED) {
                throw new AuthenticationError('Order already returned')
            }

            if (order.orderStatus === ORDER_STATUS.PENDING ) {

                if (order.paymentStatus === PAYMENT_STATUS.PENDING) {
                    order.orderStatus = ORDER_STATUS.CANCELLED
                    order.cancelledAt = new Date()
                }

                if (order.paymentStatus === PAYMENT_STATUS.PAID) {
                    try {
                        const user = await User.findById(order.user)
                    
                    if (!user) throw new NotFoundError('User not found')
                    
                    user.wallet.balance += order.totalAmount

                    order.orderStatus = ORDER_STATUS.CANCELLED
                    order.paymentStatus = PAYMENT_STATUS.REFUNDED
                    order.cancelledAt = new Date()
                    
                    await user.save()
                    await order.save()

                    console.log('updated user', user);
                    console.log('updated order', order);

                    
                    } catch (error) {
                        throw error
                    }
                }
            }
            return {order}
        } catch (error) {
            throw error
        }
    }

    static async returnOrderRequest(orderId, returnData) {
        try {
            console.log('rturn', orderId, returnData);

            const { reason, note= '' } = returnData
            
            const order = await Order.findById(orderId).populate('items.product')
            
            if (!order) throw new NotFoundError('Order not found')
                
                if (order.orderStatus !== ORDER_STATUS.DELIVERED) throw new AuthenticationError('Order cannot be returned')
                    
                    if (order.orderStatus === ORDER_STATUS.DELIVERED && order.paymentStatus === PAYMENT_STATUS.PAID) {
                        order.orderStatus = ORDER_STATUS.RETURN_INITIATED
                        order.returnInfo = {
                            reason,
                            note,
                            date: new Date()
                        }
                    }
                    
                    
                    console.log('return Order:',order);
                    await order.save()
                    console.log('return Order:',order);

            

            return {order}
        } catch (error) {
            throw error
        }
    }
}


module.exports = OrderService