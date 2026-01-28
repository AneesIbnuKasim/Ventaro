const client = require("../config/openai");
const Order = require("../models/Order");



class ChatService {
  static chatHandler = async (message) => {
    if (!message) {
      return ({ text: "Please enter a message." });
    }
    //extract order id from message

    // Extract order number
    const orderMatch = message.match(/#?(order[-\s]*)?([a-z0-9-]{10,})/i);

    if (orderMatch) {
      const orderId = message.replace(/^#/, "");

      const order = await Order.findOne({orderId});


      if (!order) {
        return ({
          text: `Sorry, I couldn't find order #${orderId}.`,
        });
      }
      switch(order.orderStatus) {
        case 'CANCELLED' : return ({
        text: `Your order #${orderId} is currently **${order.orderStatus}**.`,
      });
        case 'SHIPPED' : return ({
        text: `Your order #${orderId} is **${order.orderStatus}**. and on transit now.`,
      });
        case 'PENDING' : return ({
        text: `Your order #${orderId} is currently **${order.orderStatus}**.`,
      });
        case 'RETURN_INITIATED' : return ({
        text: `Your order #${orderId} is in **${order.orderStatus}**. process now.`,
      });
        case 'RETURNED' : return ({
        text: `Your order #${orderId} is **${order.orderStatus}**.`,
      });
        case 'DELIVERED' : return ({
        text: `Your order #${orderId} is **${order.orderStatus} already**.`,
      });
      default:       return ({
        text: `Your order #${orderId} is processing.**.`,
      });

      }

    }

     /* ---------- OPENAI FALLBACK ---------- */
//     const aiResponse = await openai.responses.create({
//   model: "gpt-4o-mini",
//   input: [
//     {
//       role: "system",
//       content: "You are a helpful ecommerce assistant. Answer briefly and clearly.",
//     },
//     {
//       role: "user",
//       content: message,
//     },
//   ],
// });

const response = await client.chat.completions.create({
  model: "allam-2-7b",
  messages: [
    {
      role: "system",
      content: "You are a helpful e-commerce website assistant. Always reply in English."
    },
    {
      role: "user",
      content: "ask me anything you want."
    }
  ]
})

const aiText = response.choices[0].message.content

console.log('chat:', aiText);

return {
  text: aiText,
};

    // return ({
    //   text:
    //     "I can help you check order status. Example: Check order status #123",
    // });
  };
}


module.exports = ChatService