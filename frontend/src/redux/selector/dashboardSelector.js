import { createSelector } from "@reduxjs/toolkit";

const selectDailyState = (state) => state.sales.Daily;
const selectWeeklyState = (state) => state.sales.Weekly;
const selectMonthlyState = (state) => state.sales.Monthly;
const selectYearlyState = (state) => state.sales.Yearly;
const selectPeriod = (state) => state.sales.filters.period;

export const selectDaily = createSelector([selectDailyState], (daily) =>
  daily.slice(-1)
);
export const selectWeekly = createSelector([selectWeeklyState], (weekly) =>
  weekly.slice(-1)
);
export const selectMonthly = createSelector([selectMonthlyState], (monthly) =>
  monthly.slice(-1)
);
export const selectYearly = createSelector([selectYearlyState], (yearly) =>
  yearly.slice(-1)
);

export const selectTotalSales = createSelector([selectPeriod, selectDaily, selectWeekly, selectMonthly, selectYearly], (period, Daily, Weekly, Monthly, Yearly) => {
  switch (period) {
    case "Daily":
      return Daily[0]?.totalSales;
    case "Weekly":
      return Weekly[0]?.totalSales;
    case "Monthly":
      return Monthly[0]?.totalSales;
    case "Yearly":
      return Yearly[0]?.totalSales;
    default:
      return [];
  }
});

export const selectTotalOrders = createSelector([selectPeriod, selectDaily, selectWeekly, selectMonthly, selectYearly], (period, Daily, Weekly, Monthly, Yearly) => {
  switch (period) {
    case "Daily":
      return Daily[0]?.orderCount;
    case "Weekly":
      return Weekly[0]?.orderCount;
    case "Monthly":
      return Monthly[0]?.orderCount;
    case "Yearly":
      return Yearly[0]?.orderCount;
    default:
      return [];
  }
});


