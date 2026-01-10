// const { default: Order } = require("../models/Order");
// const User = require("../models/User");

// class DashboardService {
//   static async fetchSalesReport(query) {
//     let { startDate, endDate, period } = query;

//     console.log("query in api server", query);

//     const start = new Date();
//     console.log("strt", start);

//     const match = { orderStatus: "DELIVERED" };

//     switch (period) {
//   case "Daily":
//     // Today only (00:00 to 23:59)
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     match.createdAt = { $gte: today, $lt: tomorrow };
//     break;

//   case "Weekly":
//     // Last 7 days
//     const weekAgo = new Date();
//     weekAgo.setDate(weekAgo.getDate() - 7);
//     weekAgo.setHours(0, 0, 0, 0);
//     match.createdAt = { $gte: weekAgo, $lt: new Date() };
//     break;

//   case "Monthly":
//     // Last 30 days
//     const monthAgo = new Date();
//     monthAgo.setDate(monthAgo.getDate() - 30);
//     monthAgo.setHours(0, 0, 0, 0);
//     match.createdAt = { $gte: monthAgo, $lt: new Date() };
//     break;

//   case "Yearly":
//     // Last 365 days
//     const yearAgo = new Date();
//     yearAgo.setDate(yearAgo.getDate() - 365);
//     yearAgo.setHours(0, 0, 0, 0);
//     match.createdAt = { $gte: yearAgo, $lt: new Date() };
//     break;

//   case "Date":
//     // Custom date range
//     if (startDate && endDate) {
//     endDate = new Date(endDate)
//     endDate.setHours(24,0,0,0)
//       match.createdAt = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate)
//       };
//     }
//     break;

//   default:
//     // No date filter
//     delete match.createdAt;
// }

//     // start.setDate(start.getDate() - 365);

//     // if (startDate && endDate) {
//     //   match.createdAt = {
//     //     $gte: new Date(startDate),
//     //     $lte: new Date(endDate),
//     //   };
//     // }

//     const report = await Order.aggregate([
//       { $match: match },
//       {
//         $facet: {
//           salesByDate: [
//             {
//               $group: {
//                 _id: {
//                   $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
//                 },
//                 totalSales: { $sum: "$totalAmount" },
//                 orderCount: { $sum: 1 },
//               },
//             },
//             { $sort: { _id: 1 } },
//           ],

//           // DAILY TOP PRODUCTS
//           topProducts: [

//             { $unwind: "$items" },
//             {
//               $group: {
//                 _id: {
//                 //   date: {
//                 //     $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
//                 //   },

//                   product: "$items.product",
//                 },
//                 quantitySold: { $sum: "$items.quantity" },
//                 revenue: {
//                   $sum: {
//                     $multiply: ["$items.quantity", "$items.finalUnitPrice"],
//                   },
//                 },
//               },
//             },
//             {
//               $lookup: {
//                 from: "products",
//                 localField: "_id.product",
//                 foreignField: "_id",
//                 as: "product",
//               },
//             },
//             { $unwind: "$product" },
//             {$limit: 10},
//             { $sort: { quantitySold: -1 } },
//           ],

//         //   Weekly: [
//         //     {
//         //       $group: {
//         //         _id: {
//         //           year: { $isoWeekYear: "$createdAt" },
//         //           week: { $isoWeek: "$createdAt" },
//         //         },
//         //         totalSales: { $sum: "$totalAmount" },
//         //         orderCount: { $sum: 1 },
//         //       },
//         //     },
//         //     { $sort: { "_id.year": 1, "_id.week": 1 } },
//         //   ],

//         //   // WEEKLY TOP PRODUCTS
//         //   WeeklyProductSales: [
//         //     { $unwind: "$items" },
//         //     {
//         //       $group: {
//         //         _id: {
//         //           year: { $isoWeekYear: "$createdAt" },
//         //           week: { $isoWeek: "$createdAt" },
//         //           product: "$items.product",
//         //         },
//         //         quantitySold: { $sum: "$items.quantity" },
//         //         revenue: {
//         //           $sum: {
//         //             $multiply: ["$items.quantity", "$items.finalUnitPrice"],
//         //           },
//         //         },
//         //       },
//         //     },
//         //     {
//         //       $lookup: {
//         //         from: "products",
//         //         localField: "_id.product",
//         //         foreignField: "_id",
//         //         as: "product",
//         //       },
//         //     },
//         //     { $unwind: "$product" },
//         //     { $sort: { quantitySold: -1 } },
//         //   ],

//         //   Monthly: [
//         //     {
//         //       $group: {
//         //         _id: {
//         //           year: { $year: "$createdAt" },
//         //           month: { $month: "$createdAt" },
//         //         },
//         //         totalSales: { $sum: "$totalAmount" },
//         //         orderCount: { $sum: 1 },
//         //       },
//         //     },
//         //     { $sort: { "_id.year": 1, "_id.month": 1 } },
//         //   ],

//         //   // MONTHLY TOP PRODUCTS
//         //   MonthlyProductSales: [
//         //     { $unwind: "$items" },
//         //     {
//         //       $group: {
//         //         _id: {
//         //           year: { $year: "$createdAt" },
//         //           month: { $month: "$createdAt" },
//         //           product: "$items.product",
//         //         },
//         //         quantitySold: { $sum: "$items.quantity" },
//         //         revenue: {
//         //           $sum: {
//         //             $multiply: ["$items.quantity", "$items.finalUnitPrice"],
//         //           },
//         //         },
//         //       },
//         //     },
//         //     {
//         //       $lookup: {
//         //         from: "products",
//         //         localField: "_id.product",
//         //         foreignField: "_id",
//         //         as: "product",
//         //       },
//         //     },
//         //     { $unwind: "$product" },
//         //     { $sort: { quantitySold: -1 } },
//         //   ],

//         //   Yearly: [
//         //     {
//         //       $group: {
//         //         _id: { year: { $year: "$createdAt" } },
//         //         totalSales: { $sum: "$totalAmount" },
//         //         orderCount: { $sum: 1 },
//         //       },
//         //     },
//         //     { $sort: { "_id.year": 1 } },
//         //   ],

//         //   // YEARLY TOP PRODUCTS
//         //   YearlyProductSales: [
//         //     { $unwind: "$items" },
//         //     {
//         //       $group: {
//         //         _id: {
//         //           year: { $year: "$createdAt" }, // Fixed: was "$year: "createdAt""
//         //           product: "$items.product",
//         //         },
//         //         quantitySold: { $sum: "$items.quantity" },
//         //         revenue: {
//         //           $sum: {
//         //             $multiply: ["$items.quantity", "$items.finalUnitPrice"],
//         //           },
//         //         },
//         //       },
//         //     },
//         //     {
//         //       $lookup: {
//         //         from: "products",
//         //         localField: "_id.product",
//         //         foreignField: "_id",
//         //         as: "product",
//         //       },
//         //     },
//         //     { $unwind: "$product" },
//         //     { $sort: { quantitySold: -1 } },
//         //   ],

//           totalSales: [
//             { $group: { _id: null, value: { $sum: "$totalAmount" } } },
//             { $project: { _id: 0, value: 1 } },
//           ],

//           totalOrders: [
//             { $group: { _id: null, value: { $sum: 1 } } },
//             { $project: { _id: 0, value: 1 } },
//           ],

//           // totalReturnOrders: [
//           //   { $group: { _id: null, value: { $sum: 1 } } },
//           //   { $project: { _id: 0, value: 1 } },
//           // ],

//           recentOrders: [
//             {$sort: {createdAt: -1}},
//             {$limit: 5},
//             {$project: {createdAt:1, orderId:1, user:1, paymentMethod:1, paymentStatus:1, totalAmount:1, _id:0}}
//           ],

//           // OVERALL TOP PRODUCTS
//         //   OverallProductSales: [
//         //     { $unwind: "$items" },
//         //     {
//         //       $group: {
//         //         _id: "$items.product",
//         //         quantitySold: { $sum: "$items.quantity" },
//         //         revenue: {
//         //           $sum: {
//         //             $multiply: ["$items.quantity", "$items.finalUnitPrice"],
//         //           },
//         //         },
//         //       },
//         //     },
//         //     {
//         //       $lookup: {
//         //         from: "products",
//         //         localField: "_id",
//         //         foreignField: "_id",
//         //         as: "product",
//         //       },
//         //     },
//         //     { $unwind: "$product" },
//         //     { $limit: 5 },
//         //     { $sort: { quantitySold: -1 } },
//         //   ],
//         },
//       },
//     ]);

//     console.log("salesReport", JSON.stringify(report[0]));

//     const users = await User.countDocuments({role: "user"})
//     const salesReport = report[0];

//     return {salesReport, users};
//   }
// }

// module.exports = DashboardService;

// const { default: Order } = require("../models/Order");
// const User = require("../models/User");

// class DashboardService {
//   static async fetchSalesReport(query) {
//     let { startDate, endDate, period } = query;

//     //  BUILD DATE MATCH (ONCE)
//     const dateMatch = {};

//     switch (period) {
//       case "Daily": {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0);
//         const tomorrow = new Date(today);
//         tomorrow.setDate(tomorrow.getDate() + 1);
//         dateMatch.createdAt = { $gte: today, $lt: tomorrow };
//         break;
//       }

//       case "Weekly": {
//         const weekAgo = new Date();
//         weekAgo.setDate(weekAgo.getDate() - 7);
//         weekAgo.setHours(0, 0, 0, 0);
//         dateMatch.createdAt = { $gte: weekAgo, $lt: new Date() };
//         break;
//       }

//       case "Monthly": {
//         const monthAgo = new Date();
//         monthAgo.setDate(monthAgo.getDate() - 30);
//         monthAgo.setHours(0, 0, 0, 0);
//         dateMatch.createdAt = { $gte: monthAgo, $lt: new Date() };
//         break;
//       }

//       case "Yearly": {
//         const yearAgo = new Date();
//         yearAgo.setDate(yearAgo.getDate() - 365);
//         yearAgo.setHours(0, 0, 0, 0);
//         dateMatch.createdAt = { $gte: yearAgo, $lt: new Date() };
//         break;
//       }

//       case "Date": {
//         if (startDate && endDate) {
//           const end = new Date(endDate);
//           end.setHours(23, 59, 59, 999);
//           dateMatch.createdAt = {
//             $gte: new Date(startDate),
//             $lte: end,
//           };
//         }
//         break;
//       }
//     }

//     //  STATUS-SPECIFIC MATCHES
//     const deliveredMatch = {
//       orderStatus: "DELIVERED",
//       ...dateMatch,
//     };

//     const returnedMatch = {
//       orderStatus: "RETURNED",
//       ...dateMatch,
//     };

//     //  AGGREGATION PIPELINE
//     const report = await Order.aggregate([
//       {
//         $facet: {
//           /* SALES TREND */
//           salesByDate: [
//             { $match: deliveredMatch },
//             {
//               $group: {
//                 _id: {
//                   $dateToString: {
//                     format: "%Y-%m-%d",
//                     date: "$createdAt",
//                   },
//                 },
//                 totalSales: { $sum: "$totalAmount" },
//                 orderCount: { $sum: 1 },
//               },
//             },
//             { $sort: { _id: 1 } },
//           ],

//           /* TOTAL SALES */
//           totalSales: [
//             { $match: deliveredMatch },
//             { $group: { _id: null, value: { $sum: "$totalAmount" } } },
//             { $project: { _id: 0, value: 1 } },
//           ],

//           /* TOTAL ORDERS */
//           totalOrders: [
//             { $match: deliveredMatch },
//             { $group: { _id: null, value: { $sum: 1 } } },
//             { $project: { _id: 0, value: 1 } },
//           ],

//           /* RETURNED ORDERS */
//           returnedOrders: [
//             { $match: returnedMatch },
//             {
//               $group: {
//                 _id: null,
//                 totalReturnedOrders: { $sum: 1 },
//                 totalReturnedAmount: { $sum: "$totalAmount" },
//               },
//             },
//             {
//               $project: {
//                 _id: 0,
//                 totalReturnedOrders: 1,
//                 totalReturnedAmount: 1,
//               },
//             },
//           ],

//           /* TOP PRODUCTS */
//           topProducts: [
//             { $match: deliveredMatch },
//             { $unwind: "$items" },
//             {
//               $group: {
//                 _id: "$items.product",
//                 quantitySold: { $sum: "$items.quantity" },
//                 revenue: {
//                   $sum: {
//                     $multiply: ["$items.quantity", "$items.finalUnitPrice"],
//                   },
//                 },
//               },
//             },
//             {
//               $lookup: {
//                 from: "products",
//                 localField: "_id",
//                 foreignField: "_id",
//                 as: "product",
//               },
//             },
//             { $unwind: "$product" },
//             { $sort: { quantitySold: -1 } },
//             { $limit: 10 },
//           ],

//           recentOrders: [
//             { $match: deliveredMatch },
//             { $sort: { createdAt: -1 } },
//             { $limit: 5 },
//             {
//               $project: {
//                 _id: 0,
//                 orderId: 1,
//                 user: 1,
//                 totalAmount: 1,
//                 paymentMethod: 1,
//                 paymentStatus: 1,
//                 createdAt: 1,
//               },
//             },
//           ],
//         },
//       },
//     ]);

//     // RESPONSE
//     const salesReport = report[0];

//     const returnedStats = salesReport.returnedOrders[0] || {
//       totalReturnedOrders: 0,
//       totalReturnedAmount: 0,
//     };

//     const totalSalesValue = salesReport.totalSales[0]?.value || 0;

//     const users = await User.countDocuments({ role: "user" });

//     return {
//       salesReport: {
//         ...salesReport,
//         returnedOrders: returnedStats,
//         netRevenue: totalSalesValue - returnedStats.totalReturnedAmount,
//       },
//       users,
//     };
//   }
// }

// module.exports = DashboardService;

const { default: Order } = require("../models/Order");
const User = require("../models/User");

class AnalyticsService {
  static async fetchAnalytics(query) {
    const { mode = "dashboard", startDate, endDate, period } = query;

    /* ---------------- DATE MATCH ---------------- */
    const dateMatch = {};

    if (mode === "dashboard") {
      const from = new Date();
          from.setDate(from.getDate() - 30);
          from.setHours(0, 0, 0, 0);
          dateMatch.updatedAt = { $gte: from, $lte: new Date() };
    }

    if (mode === "report") {
      switch (period) {
        case "Daily": {
          const today = new Date();
          today.setHours(23, 59, 59, 999);

          const from = new Date();
          from.setDate(from.getDate() - 6); // ← important (6, not 7)
          from.setHours(0, 0, 0, 0);

          dateMatch.updatedAt = {
            $gte: from,
            $lte: today,
          };
          break;
        }

        case "Weekly": {
          const from = new Date();
          from.setDate(from.getDate() - 7);
          from.setHours(0, 0, 0, 0);
          dateMatch.updatedAt = { $gte: from, $lte: new Date() };
          break;
        }

        case "Monthly": {
          const from = new Date();
          from.setDate(from.getDate() - 30);
          from.setHours(0, 0, 0, 0);
          dateMatch.updatedAt = { $gte: from, $lte: new Date() };
          break;
        }

        case "Yearly": {
          const from = new Date();
          from.setDate(from.getDate() - 365);
          from.setHours(0, 0, 0, 0);
          dateMatch.updatedAt = { $gte: from, $lte: new Date() };
          break;
        }

        case "Date": {
          if (startDate && endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            dateMatch.updatedAt = {
              $gte: new Date(startDate),
              $lte: end,
            };
          }
          break;
        }
      }
    }

    const deliveredMatch = { orderStatus: "DELIVERED", ...dateMatch };
    const returnedMatch = { orderStatus: "RETURNED", ...dateMatch };

    /* ---------------- PIPELINE ---------------- */
    const pipeline = {
      totalSales: [
        { $match: deliveredMatch },
        { $group: { _id: null, value: { $sum: "$totalAmount" } } },
        { $project: { _id: 0, value: 1 } },
      ],

      totalOrders: [
        { $match: deliveredMatch },
        { $group: { _id: null, value: { $sum: 1 } } },
        { $project: { _id: 0, value: 1 } },
      ],

      returnedOrders: [
        { $match: returnedMatch },
        {
          $group: {
            _id: null,
            totalReturnedOrders: { $sum: 1 },
            totalReturnedAmount: { $sum: "$totalAmount" },
          },
        },
        { $project: { _id: 0 } },
      ],

      topProducts: [
        { $match: deliveredMatch },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            quantitySold: { $sum: "$items.quantity" },
            revenue: {
              $sum: {
                $multiply: ["$items.quantity", "$items.finalUnitPrice"],
              },
            },
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        { $sort: { quantitySold: -1 } },
        { $limit: mode === "dashboard" ? 5 : 10 },
      ],

      recentOrders: [
        { $match: deliveredMatch },
        { $sort: { createdAt: -1 } },
        { $limit: mode === "dashboard" ? 5 : 10 },
        {
          $project: {
            _id: 0,
            orderId: 1,
            totalAmount: 1,
            paymentMethod: 1,
            createdAt: 1,
          },
        },
      ],
    };

    pipeline.salesByDate = [
      { $match: deliveredMatch },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      ...(mode === "dashboard" ? [{ $limit: 7 }] : []),
    ];

    const [result] = await Order.aggregate([{ $facet: pipeline }]);

    const returned = result.returnedOrders[0] || {
      totalReturnedOrders: 0,
      totalReturnedAmount: 0,
    };

    const totalSales = result.totalSales[0]?.value || 0;

    const users = await User.countDocuments({ role: "user" });

    return {
      ...result,
      returnedOrders: returned,
      netRevenue: totalSales - returned.totalReturnedAmount,
      users,
    };
  }
}

module.exports = AnalyticsService;
