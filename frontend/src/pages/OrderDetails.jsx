import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";

// mock data – replace with API call
const order = {
  _id: "694be367853634114218229b",
  createdAt: "2025-12-24T12:58:15.555Z",
  paymentMethod: "Razorpay",
  paymentStatus: "PAID",
  totalAmount: 998,
  deliveryAddress: {
    name: "John Doe",
    phone: "9458439333",
    addressLine: "sdfdsf",
    city: "Doha",
    state: "Kannur",
    pincode: "670001",
    label: "Home"
  },
  items: [
    {
      _id: "item1",
      product: {
        name: "Amazfit Unisex Gts 3 Smartwatch",
        images: ["/watch.png"],
      },
      quantity: 2,
      finalUnitPrice: 499,
      itemTotal: 998,
      status: "DELIVERED",
      deliveredOn: "Dec 26, 2025"
    }
  ]
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-600 mb-6"
        >
          <ArrowLeft size={16} /> Back to Orders
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-semibold">{order._id}</p>
              <p className="text-sm text-gray-500 mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Payment</p>
              <p className="font-medium">{order.paymentMethod}</p>
              <p className="text-green-600 text-sm font-medium">
                {order.paymentStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold mb-4">Items</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item._id} className="flex gap-4">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-24 h-24 rounded-xl border object-cover"
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
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold mb-3">Delivery Address</h2>
            <p className="font-medium">{order.deliveryAddress.name}</p>
            <p className="text-sm text-gray-600">
              {order.deliveryAddress.addressLine}
            </p>
            <p className="text-sm text-gray-600">
              {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
            </p>
            <p className="text-sm text-gray-600">
              Phone: {order.deliveryAddress.phone}
            </p>
            <span className="inline-block mt-2 text-xs bg-gray-100 px-3 py-1 rounded-full">
              {order.deliveryAddress.label}
            </span>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold mb-3">Order Summary</h2>
            <div className="flex justify-between text-sm mb-2">
              <span>Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
              <span>Grand Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
wez`                                                                                                                                            `