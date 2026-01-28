const { default: mongoose } = require("mongoose");
const { ORDER_STATUS, PAYMENT_STATUS } = require("../config/config");
const Order = require("../models/Order");
const User = require("../models/User");
const {
  NotFoundError,
  ValidationError,
} = require("../utils/errors");
const Product = require("../models/Product");

class OrderService {
  static async fetchOrders(userId=null, query) {
    try {
      const { search = "", status } = query;
      const page = parseInt(query.page) || 1;

      const limit = parseInt(query.limit) || 10;

      const skipValue = (page - 1) * limit;

      const filter = {};

      if (userId) filter.user = userId

      if (search) filter.orderId = { $regex: search, $options: "i" };

      if (status) filter.orderStatus = status;

      const [orders, totalOrders] = await Promise.all([
        Order.find(filter)
          .populate("items.product")
          .sort({ createdAt: -1 })
          .skip(skipValue)
          .limit(limit),
        Order.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(totalOrders / limit);

      return {
        orders,
        pagination: {
          limit,
          page,
          totalPages,
          totalOrders,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  //FETCH ORDER BY ID
  static async fetchOrderById(orderId) {
    try {
      const order = await Order.findOne({ _id: orderId }).populate(
        "items.product"
      );
      return { order };
    } catch (error) {
      throw error;
    }
  }

  //CANCEL AN ORDER
  static async cancelOrder(orderId) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const order = await Order.findById(orderId)
        .populate("items.product")
        .session(session);

      if (!order) throw new NotFoundError("Order not found");

      if (
        order.orderStatus === ORDER_STATUS.SHIPPED ||
        order.orderStatus === ORDER_STATUS.DELIVERED
      ) {
        throw new ValidationError("Order cannot be cancelled now.");
      }

      if (order.orderStatus === ORDER_STATUS.CANCELLED) {
        throw new ValidationError("Order already cancelled.");
      }

      if (order.orderStatus === ORDER_STATUS.RETURNED) {
        throw new ValidationError("Order already returned");
      }

      if (order.orderStatus === ORDER_STATUS.PENDING) {
        //restore stock
        for (const item of order.items) {
          await Product.updateOne(
            { _id: item.product._id },
            { $inc: { stock: item.quantity } },
            { session }
          );
        }

        if (order.paymentStatus === PAYMENT_STATUS.PENDING) {
          order.orderStatus = ORDER_STATUS.CANCELLED;
          order.cancelledAt = new Date();
        }

        if (order.paymentStatus === PAYMENT_STATUS.PAID) {
          const user = await User.findById(order.user).session(session);

          if (!user) throw new NotFoundError("User not found");

          user.wallet.balance += order.totalAmount;

          order.orderStatus = ORDER_STATUS.CANCELLED;
          order.paymentStatus = PAYMENT_STATUS.REFUNDED;
          order.cancelledAt = new Date();

          await user.save({ session });
        }
        await order.save({ session });

        await session.commitTransaction();
        session.endSession();
      }

      return { order };
    } catch (error) {
      throw error;
    }
  }

  static async returnOrderRequest(orderId, returnData) {
    try {
      const { reason, note = "" } = returnData;

      const order = await Order.findById(orderId).populate("items.product");

      if (!order) throw new NotFoundError("Order not found");

      if (order.orderStatus !== ORDER_STATUS.DELIVERED)
        throw new ValidationError("Order cannot be returned");

      if (
        order.orderStatus === ORDER_STATUS.DELIVERED &&
        order.paymentStatus === PAYMENT_STATUS.PAID
      ) {
        order.orderStatus = ORDER_STATUS.RETURN_INITIATED;
        order.returnInfo = {
          reason,
          note,
          date: new Date(),
        };
      }

      await order.save();

      return { order };
    } catch (error) {
      throw error;
    }
  }

  // ADMIN ACTIONS

  //CHANGE ORDER STATUS
  static async updateStatus(orderId, status) {
    try {
        
        const { updateStatus } = status
        
      const order = await Order.findById(orderId).populate("items.product");

      if (!order) throw new NotFoundError("Order not found");

      if (updateStatus === ORDER_STATUS.DELIVERED) {
        order.orderStatus = updateStatus;
        order.paymentStatus = PAYMENT_STATUS.PAID;
      }

      else if (updateStatus === ORDER_STATUS.CANCELLED || updateStatus === ORDER_STATUS.RETURNED) {
        order.orderStatus = updateStatus;

        if (order.paymentStatus === PAYMENT_STATUS.PAID) {
          //refund to wallet if already paid
          const user = await User.findById(order.user);

          if (!user) throw new NotFoundError("User not found");

          user.wallet.balance += order.totalAmount

          await user.save()
        }  
    }
    else if (updateStatus === ORDER_STATUS.PENDING || updateStatus === ORDER_STATUS.SHIPPED || updateStatus === ORDER_STATUS.RETURN_INITIATED) {
        
        order.orderStatus = updateStatus
    }

    // order.orderStatus = status

      await order.save();

      return { order };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OrderService;
