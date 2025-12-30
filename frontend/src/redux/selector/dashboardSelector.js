import { createSelector } from "@reduxjs/toolkit";

const selectDailyState = (state) => state.sales.Daily;
const selectWeeklyState = (state) => state.sales.Weekly;
const selectMonthlyState = (state) => state.sales.Monthly;
const selectYearlyState = (state) => state.sales.Yearly;
const selectTotalOrdersState = (state) => state.sales.totalOrders;
const selectTotalSalesState = (state) => state.sales.totalSales
const selectPeriod = (state) => state.sales.filters.period;

export const selectDaily = createSelector([selectDailyState], (daily) =>
  daily
);
export const selectWeekly = createSelector([selectWeeklyState], (weekly) =>
  weekly
);
export const selectMonthly = createSelector([selectMonthlyState], (monthly) =>
  monthly
);
export const selectYearly = createSelector([selectYearlyState], (yearly) =>
  yearly
);

export const selectTotalSales = createSelector([selectPeriod, selectDaily, selectWeekly, selectMonthly, selectYearly, selectTotalSalesState], (period, Daily, Weekly, Monthly, Yearly, DateTotalSales) => {
//   switch (period) {
//     case "Daily":
//       return Daily[0]?.totalSales;
//     case "Weekly":
//       return Weekly[0]?.totalSales;
//     case "Monthly":
//       return Monthly[0]?.totalSales;
//     case "Yearly":
//       return Yearly[0]?.totalSales;
//     case "Date":
//       return DateTotalSales;
//     default:
//       return [];
//   }
});

export const selectTotalOrders = createSelector([selectPeriod, selectDaily, selectWeekly, selectMonthly, selectYearly, selectTotalOrdersState], (period, Daily, Weekly, Monthly, Yearly, DateTotalOrders) => {
//   switch (period) {
//     case "Daily":
//       return Daily[0]?.orderCount;
//     case "Weekly":
//       return Weekly[0]?.orderCount;
//     case "Monthly":
//       return Monthly[0]?.orderCount;
//     case "Yearly":
//       return Yearly[0]?.orderCount;
//     case "Date":
//       return DateTotalOrders;
//     default:
//       return [];
//   }
});


