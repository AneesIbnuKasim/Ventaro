import { CheckCircle, Clock } from "lucide-react";
import { API_CONFIG } from "../../config/app";
import { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";

export default function OrderItemCard({ order, onCancel }) {

  const [cancelId, setCancelId] = useState(null)
  const deliveryDate = (date) => {
    date.setDate(date.getDate()+ 7)
    return date
  }

  const handleCancelConfirm = useMemo(() => {

  })

  useEffect(() => {
    console.log('can', cancelId);
    
  }, [cancelId])
  return (
    <div className="flex gap-6">
      <img
        src={`${API_CONFIG.imageURL2}${order?.items[0]?.product?.images?.[0]}`}
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
            Cancelled on {new Date(order.cancelledAt).toDateString()}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-orange-500 mt-2">
            <Clock size={16} />
            Delivery expected by {deliveryDate(new Date(order.createdAt)).toDateString()}
          </div>
        )}

        <div className="flex gap-4 mt-4 text-sm">
          <button className="text-blue-600 hover:underline">Details</button>
          {order.orderStatus === "PENDING" && (
            <button
              onClick={() => setCancelId(order._id)}
              className="text-red-500 hover:underline"
            >
              Cancel
            </button>
          )}
        </div>


{/* Delete confirmation modal */}
        <ConfirmDialog
          isOpen={cancelId ? true : false}
          title="Are you sure to delete"
          onCancel={() => setCancelId(null)}
          onConfirm={() => {
            onCancel(cancelId)
            setCancelId(null)
          }}
        />

      </div>
    </div>
  );
}
