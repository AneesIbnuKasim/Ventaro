import { useEffect } from "react";
import OrderItemCard from "../components/ui/OrderItemCard";
import { useDispatch, useSelector } from "react-redux";
import { cancelOrderThunk, fetchOrderThunk } from "../redux/slices/orderSlice";

export default function Orders() {

  const { orders } = useSelector(state => state.order)

  const dispatch = useDispatch()

console.log('orders in orders', orders);

    useEffect(() => {
        dispatch(fetchOrderThunk())
    }, [])

    const handleCancel = async(orderId) => {
      await dispatch(cancelOrderThunk(orderId)).unwrap()
      
    }
  return (
      <div className="max-w-6xl mx-auto px-4 flex gap-8">


        {/* RIGHT CONTENT */}
        <main className="flex-1">
          <h1 className="text-xl font-semibold mb-6">My Orders</h1>

          <div className="space-y-8">
            {orders?.map((order) => (
              <div
                key={order._id}
                className="bg-gray-50 rounded-2xl p-6 shadow-sm"
              >
                {/* ORDER HEADER */}
                <div className="flex justify-between items-center pb-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>
                    <p className="font-medium">{order._id}</p>
                  </div>

                  <div className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toDateString()}
                  </div>
                </div>

                {/* ORDER ITEMS */}
                <div className="space-y-4">
                    <OrderItemCard order={order} onCancel={(orderId)=>handleCancel(orderId)} />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
  );
}