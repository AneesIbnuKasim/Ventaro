import { useCallback, useEffect } from "react";
import OrderItemCard from "../components/ui/OrderItemCard";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelOrderThunk,
  fetchOrderThunk,
  returnOrderRequestThunk,
  setPagination,
} from "../redux/slices/orderSlice";
import { Pagination } from "../components/ui";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Orders() {
  const { orders, pagination } = useSelector((state) => state.order);
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();

useEffect(() => {
  const page = Number(searchParams.get("page")) || 1;
  dispatch(setPagination({ page }));
  window.scrollTo(0,'smooth')
}, [searchParams, dispatch]);

useEffect(() => {
  if (!pagination.page) return;

  dispatch(
    fetchOrderThunk({
      page: pagination.page,
    })
  );
}, [dispatch, pagination.page]);

  // useEffect(() => {
  //   console.log("pagination:::", pagination);
  // }, [pagination]);
  const handleCancel = async (orderId) => {
    await dispatch(cancelOrderThunk(orderId)).unwrap();
  };

  const handleReturn = useCallback(async (returnData) => {
    dispatch(returnOrderRequestThunk(returnData));
  });

  const handlePageChange = ({ page }) => {
  dispatch(setPagination({ page }));
  navigate(`?page=${page}`, { replace: true });
};

  return (
    <>
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
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">{order.orderId}</p>
                  </div>

                  <div className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toDateString()}
                  </div>
                </div>

                {/* ORDER ITEMS */}
                <div className="space-y-4">
                  <OrderItemCard
                    order={order}
                    onCancel={(orderId) => handleCancel(orderId)}
                    handleReturn={handleReturn}
                  />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Pagination
        currentPage={pagination.page}
        itemsPerPage={pagination.limit}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalOrders}
        onPageChange={handlePageChange}
      />
    </>
  );
}
