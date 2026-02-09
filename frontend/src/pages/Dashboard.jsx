import React, { memo, useEffect } from "react";
import { Box, ShoppingCart, RotateCcw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import ReportStatsCard from "../components/ui/ReportStatsCard";
import SalesChart from "../components/ui/SalesChart";
import { fetchSalesReport } from "../redux/slices/salesSlice";
import { API_CONFIG } from "../config/app";
import { CURRENCY } from "../constants/ui";
import formatImageUrl from "../utils/formatImageUrl";
import { DashboardSkeleton } from "../components/ui/DashboardSkeleton.jsx";

const Dashboard = memo(() => {
  const dispatch = useDispatch();

  const {
    salesByDate,
    topProducts,
    totalSales,
    totalOrders,
    returnedOrders,
    loading
  } = useSelector((state) => state.sales);

  // Dashboard uses FIXED period (no filters)
  useEffect(() => {
    dispatch(fetchSalesReport({ mode: "dashboard", period: "Monthly" }));
  }, [dispatch]);

  return loading ? (
    <DashboardSkeleton />
  ) :
  (

    <div className="flex flex-col gap-6">
      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportStatsCard
          title="Total Sales"
          icon={<ShoppingCart className="w-6 h-6 text-violet-500" />}
          value={`${CURRENCY} ${Math.round(totalSales || 0)}`}
          timeFrame="This Month"
          className="bg-violet-50"
        />

        <ReportStatsCard
          title="Total Orders"
          icon={<Box className="w-6 h-6 text-blue-500" />}
          value={totalOrders || 0}
          timeFrame="This Month"
          className="bg-blue-50"
        />

        <ReportStatsCard
          title="Returned Orders"
          icon={<RotateCcw className="w-6 h-6 text-red-500" />}
          value={returnedOrders?.totalReturnedOrders || 0}
          timeFrame="This Month"
          className="bg-red-50"
        />

        <ReportStatsCard
          title="Returned Amount"
          icon={<RotateCcw className="w-6 h-6 text-orange-500" />}
          value={`${CURRENCY} ${returnedOrders?.totalReturnedAmount || 0}`}
          timeFrame="This Month"
          className="bg-orange-50"
        />
      </div>

      {/* ================= SALES CHART ================= */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3">Sales Overview (Last 30 Days)</h3>

        {salesByDate?.length > 0 ? (
          <SalesChart data={salesByDate} />
        ) : (
          <p className="text-center text-gray-500 py-10">
            No sales data available
          </p>
        )}
      </div>

      {/* ================= TOP PRODUCTS ================= */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3">Top Selling Products</h3>

        {topProducts?.length > 0 ? (
          <div className="space-y-3">
            {topProducts.slice(0, 5).map((prod) => (
              <div
                key={prod._id}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    // src={`${prod?.product?.images?.[0].url.startsWith('http')}` ? `${prod?.product?.images?.[0].url}` : `${API_CONFIG.imageURL2}${prod?.product?.images?.[0].url}`}
                    src={formatImageUrl(prod?.product?.images?.[0])}
                    alt={prod?.product?.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {prod?.product?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty Sold: {prod.quantitySold}
                    </p>
                  </div>
                </div>

                <p className="text-sm font-semibold">
                  {CURRENCY} {Math.round(prod.revenue)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6">
            No product sales yet
          </p>
        )}
      </div>
    </div>
  )
});

export default Dashboard;