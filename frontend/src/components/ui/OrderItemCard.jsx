import { CheckCircle, Clock } from "lucide-react";
import { API_CONFIG } from "../../config/app";

export default function OrderItemCard({ order, onCancel }) {
  return (
    <div className="flex gap-6">
      <img
        src={`${API_CONFIG.imageURL2}${order?.items[0]?.product?.images[0]}`}
        alt={order.title}
        className="w-24 h-24 rounded-xl object-cover"
      />

      <div className="flex-1">
        <h3 className="font-medium">{order.title}</h3>
        <p className="font-semibold mt-2">Order Amount: ₹{order.totalAmount}</p>
        <p className="text-sm text-gray-500 mt-1">{order.paymentStatus}</p>

        {order.orderStatus === "DELIVERED" ? (
          <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
            <CheckCircle size={16} />
            Delivered on {order.deliveredOn}
          </div>
        ) : order.orderStatus === "CANCELLED" ? (
          <div className="flex items-center gap-2 text-sm text-orange-500 mt-2">
            <Clock size={16} />
            Cancelled on {order.cancelledAt}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-orange-500 mt-2">
            <Clock size={16} />
            Delivery expected by {order.expectedBy}
          </div>
        )}

        <div className="flex gap-4 mt-4 text-sm">
          <button className="text-blue-600 hover:underline">Details</button>
          {order.orderStatus === "PENDING" && (
            <button
              onClick={() => onCancel(order._id)}
              className="text-red-500 hover:underline"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
