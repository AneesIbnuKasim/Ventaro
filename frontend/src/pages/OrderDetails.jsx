import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchSingleOrderThunk } from "../redux/slices/orderSlice";
import { API_CONFIG } from "../config/app";
import { Loading } from "../components/ui";


const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { selectedOrder, loading } = useSelector(state => state.order)

  useEffect(() => {
  dispatch(fetchSingleOrderThunk(orderId));
}, [dispatch, orderId]);
console.log('loaded order', selectedOrder);

if (!selectedOrder) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      Loading order details...
    </div>
  );
}

if (loading) {
  return (
    <Loading />
  )
}

  return (
      !loading && selectedOrder && (
        <div className="min-h-[70vh] py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 mb-6"
        >
          <ArrowLeft size={16} /> Back to Orders
        </button>

        {/* Header */}
        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-semibold">{selectedOrder._id}</p>
              <p className="text-sm text-gray-500 mt-1">
                Placed on {formatDate(selectedOrder.createdAt)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Payment</p>
              <p className="font-medium">{selectedOrder.paymentMethod}</p>
              <p className="text-green-600 text-sm font-medium">
                {selectedOrder.paymentStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-gray-50 rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold mb-4">Items</h2>
          <div className="space-y-4">
            {selectedOrder?.items?.map((item) => (
              <div key={item._id} className="flex gap-4">
                <img
                  src={`${API_CONFIG.imageURL2}${item.product.images[0]}`}
                  alt={item.product?.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    ₹{item.finalUnitPrice} × {item.quantity}
                  </p>
                  <p className="font-semibold mt-1">₹{item.itemTotal}</p>

                  {item.status === "DELIVERED" ? (
                    <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
                      <CheckCircle size={16} /> Delivered on {item.deliveredOn}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-orange-500 mt-2">
                      <Clock size={16} /> Processing
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Address & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address */}
          <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold mb-3">Delivery Address</h2>
            <p className="font-medium">{selectedOrder.deliveryAddress.name}</p>
            <p className="text-sm text-gray-600">
              {selectedOrder.deliveryAddress.addressLine}
            </p>
            <p className="text-sm text-gray-600">
              {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} - {selectedOrder.deliveryAddress.pincode}
            </p>
            <p className="text-sm text-gray-600">
              Phone: {selectedOrder.deliveryAddress.phone}
            </p>
            <span className="inline-block mt-2 text-xs bg-purple-300 px-3 py-1 rounded-full">
              {selectedOrder.deliveryAddress.label}
            </span>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold mb-3">Order Summary</h2>
            <div className="flex justify-between text-sm mb-2">
              <span>Total</span>
              <span>₹{selectedOrder.totalAmount}</span>
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
              <span>Grand Total</span>
              <span>₹{selectedOrder.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
      )
    )
  
}