import { createSelector } from "@reduxjs/toolkit";
import { SHIPPING } from "../../config/app";

export const selectCartItems = (state) => state.cart.items;
export const selectAppliedCoupon = state => state.cart.appliedCoupon;

export const selectTotalQuantity = createSelector(
  [selectCartItems],
  (items) => items.reduce((sum, item) => sum + item.quantity, 0)
);

export const selectSubTotal = createSelector(
  [selectCartItems],
  (items=[]) =>
    items.reduce((sum, item) => sum + item.basePrice * item.quantity, 0)
);

export const selectDiscountTotal = createSelector(
  [selectSubTotal, selectAppliedCoupon],
  (subTotal, coupon) => {
    if (!coupon) return 0;

    return coupon.discountType === "PERCENT"
      ? (subTotal * coupon.discountValue) / 100
      : coupon.discountValue;
  }
);

export const selectPayableTotal = createSelector(
  [selectSubTotal, selectDiscountTotal],
  (subTotal, discount) =>
    Math.max(0, subTotal - discount)
);

export const selectShippingFee = createSelector(
  [selectPayableTotal],
  (payableTotal) =>
    payableTotal > SHIPPING.freeShippingThreshold ? 0 : SHIPPING.shippingFee 
);

export const selectRemainingForFreeDelivery = createSelector(
  [selectPayableTotal],
  (payableTotal) => 
    Math.max(0, SHIPPING.freeShippingThreshold - payableTotal)
)

export const selectGrandTotal = createSelector(
  [selectPayableTotal, selectShippingFee],
  (payableTotal, shippingFee) => payableTotal + shippingFee
);

export const selectCartTotals = createSelector(
  [
    selectCartItems,
    selectSubTotal,
    selectDiscountTotal,
    selectPayableTotal,
    selectShippingFee,
    selectGrandTotal,
    selectTotalQuantity,
    selectRemainingForFreeDelivery
  ],
  (
    items,
    subTotal,
    discountTotal,
    payableTotal,
    shippingFee,
    grandTotal,
    totalQuantity,
    remainingForFreeDelivery
  ) => ({
    items,
    subTotal,
    discountTotal,
    payableTotal,
    shippingFee,
    grandTotal,
    totalQuantity,
    remainingForFreeDelivery
  })
);