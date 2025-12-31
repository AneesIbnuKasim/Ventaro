const { default: Order } = require("../models/Order");

class ChatService {
  static chatHandler = async (message) => {
    if (!message) {
      return ({ text: "Please enter a message." });
    }
    //extract order id from message

    // Extract order number
    const orderMatch = message.match(/#?(order[-\s]*)?([a-z0-9-]{10,})/i);
    console.log('order match', orderMatch);
    

    if (orderMatch) {
      const orderId = message.replace(/^#/, "");

      console.log('order id', orderId);
      

      const order = await Order.findOne({orderId});


      if (!order) {
        return ({
          text: `Sorry, I couldn't find order #${orderId}.`,
        });
      }

      return ({
        text: `Your order #${orderId} is currently **${order.orderStatus}**.`,
      });
    }

    return ({
      text:
        "I can help you check order status. Example: Check order status #123",
    });
  };
}


module.exports = ChatService