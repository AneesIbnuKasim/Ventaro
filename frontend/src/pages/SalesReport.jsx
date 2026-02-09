import React, { memo, useEffect } from "react";
import { Button } from "../components/ui";
import { Box, ShoppingCart, User } from "lucide-react";
import ReportStatsCard from "../components/ui/ReportStatsCard";
import DateFilter from "../components/ui/DateFilter";
import SalesChart from "../components/ui/SalesChart";
import Table from "../components/ui/Table";
import { fetchSalesReport, setFilters } from "../redux/slices/salesSlice";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { CURRENCY } from "../constants/ui";
import { toast } from "react-toastify";
import formatImageUrl from "../utils/formatImageUrl";
import { DashboardSkeleton } from "../components/ui/DashboardSkeleton.jsx";

const SalesReport = memo(() => {
  const {
    filters,
    salesByDate,
    topProducts,
    totalSales,
    totalOrders,
    recentOrders,
    totalUsers,
    returnedOrders,
    loading
  } = useSelector((state) => state.sales);
  const period = filters.period;
  const dispatch = useDispatch();

  const query = {
    period,
    startDate: filters.startDate,
    endDate: filters.endDate,
  };

  useEffect(() => {
    dispatch(fetchSalesReport({mode:'report', ...query}));
  }, [filters.startDate, filters.endDate, filters.period]);

  const handlePeriodSelect = (data) => {
    dispatch(setFilters(data));
  };
  const handleStartDate = (data) => {
    dispatch(setFilters(data));
  };
  const handleEndDate = (data) => {
    dispatch(setFilters(data));
  };

  //PDF DOWNLOAD SETTINGS
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.text(`${period} Sales Report`, 14, 22);
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 35);

      let yPosition = 45;

      // Daily Sales Table
      if (salesByDate?.length > 0) {
        autoTable(doc, {
          startY: yPosition,
          head: [["Date", "Total Sales", "Order Count"]],
          body: salesByDate.map((row) => [
            row._id,
            `Rs. ${Number(row.totalSales).toLocaleString()}`,
            row.orderCount,
          ]),
          theme: "grid",
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          margin: { left: 14, right: 14 },
        });
        yPosition = doc.lastAutoTable.finalY + 15;
      }

      // Overall Totals
      doc.setFontSize(14);
      doc.text("Overall Totals", 14, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      doc.text(`Total Sales: Rs. ${Number(totalSales || 0)}`, 14, yPosition);
      yPosition += 15;
      doc.text(
        `Total Orders: ${Number(totalOrders || 0).toLocaleString()}`,
        14,
        yPosition
      );
      yPosition += 20;

      // Top Products
      if (topProducts?.length > 0) {
        autoTable(doc, {
          startY: yPosition,
          head: [["Product", "Quantity Sold", "Revenue"]],
          body: topProducts
            .slice(0, 10)
            .map((row) => [
              row.product?.name || row.product?.title || "N/A",
              row.quantitySold,
              `Rs. ${Number(row.revenue)}`,
            ]),
          theme: "grid",
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [46, 125, 50], textColor: 255 },
          margin: { left: 14, right: 14 },
        });
      }

      doc.save(`${period.toLowerCase()}-sales-report.pdf`);
    } catch (error) {
      console.error("PDF Export failed:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };
  return loading ? (
    <DashboardSkeleton />
  ) :
  (
    <>
      {/* {open && (
        <Modal
          isOpen={open}
          size="xl"
          onClose={closeProductForm}
          className= 'overflow-y-auto'
          title={editData ? "Edit Product" : "Add Product"}
        >
          <ProductForm onConfirm={handleSubmit} editData={editData} onCancel={handleCancel} />
        </Modal>
      )} */}

      <div className="sm:flex justify-around items-center bg-white mb-5 rounded-lg">
        <DateFilter
          filters={filters}
          periodPicker={handlePeriodSelect}
          handleEndDate={handleEndDate}
          handleStartDate={handleStartDate}
        />

        <Button
          size="sm"
          variant={"custom"}
          style={{ height: 30 }}
          onClick={() => exportToPDF()}
          className={"m-4"}
        >
          DOWNLOAD REPORT
        </Button>
      </div>

      <div className=" flex flex-col gap-4">
        <div className="flex gap-5">
          <ReportStatsCard
            title={"Total Sales"}
            icon={<ShoppingCart className="w-13 h-13 text-violet-500" />}
            value={`${CURRENCY} ${Math.round(totalSales) || 0} `}
            timeFrame={
              period === "Daily"
                ? "Today"
                : period === "Weekly"
                ? "Last 7 Days"
                : period === "Monthly"
                ? "Last 30 days"
                : period === "Yearly"
                ? "Last 365 Days"
                : filters.startDate === "" && period === "Date"
                ? `${filters.startDate} / ${filters.endDate}`
                : "Overall"
            }
            
            className="flex-1 bg-red-50"
          />
          <ReportStatsCard
            title={"Total Orders"}
            icon={<Box className="w-13 h-13 text-violet-500" />}
            value={`${totalOrders || 0} `}
            timeFrame={
              period === "Daily"
                ? "Today"
                : period === "Weekly"
                ? "Last 7 Days"
                : period === "Monthly"
                ? "Last 30 days"
                : period === "Yearly"
                ? "Last 365 Days"
                : filters.startDate === "" && period === "Date"
                ? `${filters.startDate} / ${filters.endDate}`
                : "Overall"
            }
            
            className="flex-1 bg-red-50"
          />
          <ReportStatsCard
            title={"Total returned orders"}
            icon={<User className="w-13 h-13 text-violet-500" />}
            value={`${returnedOrders?.totalReturnedOrders || 0} `}
            timeFrame={
              period === "Daily"
                ? "Today"
                : period === "Weekly"
                ? "Last 7 Days"
                : period === "Monthly"
                ? "Last 30 days"
                : period === "Yearly"
                ? "Last 365 Days"
                : filters.startDate === "" && period === "Date"
                ? `${filters.startDate} / ${filters.endDate}`
                : "Overall"
            }
            
            className="flex-1 bg-red-50"
          />
          <ReportStatsCard
            title={"Total Returned Amount"}
            icon={<ShoppingCart className="w-13 h-13 text-violet-500" />}
            value={`${CURRENCY} ${returnedOrders?.totalReturnedAmount || 0} `}
            timeFrame={
              period === "Daily"
                ? "Today"
                : period === "Weekly"
                ? "Last 7 Days"
                : period === "Monthly"
                ? "Last 30 days"
                : period === "Yearly"
                ? "Last 365 Days"
                : filters.startDate === "" && period === "Date"
                ? `${filters.startDate} / ${filters.endDate}`
                : "Overall"
            }
            
            className="flex-1 bg-red-50"
          />
        </div>

        {salesByDate?.length > 0 ? (
          <>
            <div className="flex flex-col gap-4">
              <SalesChart data={salesByDate} className="flex-1" />
              <div
                className={`bg-white flex flex-1 flex-col min-h-25 rounded-lg p-4 gap-3 shadow `}
              >
                <div>
                  <p className="text-sm text-gray-500">Top Selling Products</p>
                </div>
                <div className="flex gap-3 justify-between items-center">
                  <h2 className="text-xs mt-1 w-50">Img</h2>
                  <h2 className="text-xs mt-1 w-50 ">Product Name</h2>
                  <h2 className="text-xs mt-1 w-50">Quantity Sold</h2>
                  <h2 className="text-xs mt-1">Total revenue</h2>
                </div>
                {topProducts?.map((prod) => (
                  <div className="flex gap-3 justify-between items-center">
                    <img
                      width={50}
                      height={50}
                      src={formatImageUrl(prod?.product?.images[0])}
                      alt="product image"
                    />

                    <h2 className="text-xs mt-1 w-50 ">
                      {prod?.product?.name}
                    </h2>
                    <h2 className="text-xs mt-1 ">{prod.quantitySold}</h2>
                    <h2 className="text-xs mt-1">{prod.revenue}</h2>
                  </div>
                ))}
                <div className="flex items-end justify-end">
                  <p className="caption">
                    {period === "Daily"
                      ? "Today"
                      : period === "Weekly"
                      ? "Last 7 Days"
                      : period === "Monthly"
                      ? "Last 30 days"
                      : period === "Yearly"
                      ? "Last 365 Days"
                      : `${filters.startDate} to ${filters.endDate}`}
                  </p>
                </div>
              </div>
            </div>

            <Table
              columns={[
                "order Id",
                "total Amount",
                "payment Method",
              ]}
              data={recentOrders ?? []}
            />
          </>
        ) : (
          <div className="w-full  h-50 flex justify-center ">
            <h1 className="h2 mt-30"> No Sales on this period...</h1>
          </div>
        )}
      </div>
    </>
  )
});

export default SalesReport;
