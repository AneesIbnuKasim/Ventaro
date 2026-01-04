import { createSelector } from "@reduxjs/toolkit";
import { SHIPPING } from "../../config/app";
import { toast } from "react-toastify";

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
  [selectSubTotal, selectAppliedCoupon, selectCartItems],
  (subTotal, coupon, cartItems) => {
    if (!coupon) return 0;

    //ACTIVE CHECK
        if (!coupon.isActive) return toast.error('Coupon not active')
        
        //EXPIRY CHECK
        if (coupon.endDate < new Date()) return new toast.error('Coupon expired')

        //USAGE LIMIT CHECK
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return toast.error('Coupon usage limit exceeded')
        
        //MINIMUM CART VALUE
        if (coupon.minOrderAmount && subTotal < coupon.minOrderAmount) return toast.error(`Minimum cart value ${coupon.minOrderAmount} required`)
        if ( subTotal < 100) return toast.error(`Minimum cart value ${100} required`)

        //category check
        if (coupon?.applicableCategories.length) {
            const isApplicable = cartItems.some(item => (
                coupon.applicableCategories.includes(item.product.categoryId)
            ))

            if (!isApplicable) return toast.error('Coupon not applicable to selected items')

        }

    let discount =0

        if (coupon.discountType === 'PERCENT') {
            discount = (subTotal * coupon.discountValue)/100
        } else {
            discount = coupon.discountValue
        }

        if (coupon.maxDiscountAmount) {
            discount = Math.round( Math.min(discount, coupon.maxDiscountAmount))
        }

        return Math.max(discount)
  }
);

export const selectPayableTotal = createSelector(
  [selectSubTotal, selectDiscountTotal],
  (subTotal, discount) =>
    Math.max(Math.max(0, subTotal - discount))
);

export const selectShippingFee = createSelector(
  [selectSubTotal],
  (subTotal) =>
    subTotal > SHIPPING.freeShippingThreshold ? 0 : SHIPPING.shippingFee 
);

export const selectRemainingForFreeDelivery = createSelector(
  [selectSubTotal],
  (subTotal) => 
    Math.round(Math.max(0, SHIPPING.freeShippingThreshold - subTotal+1))
)

export const selectGrandTotal = createSelector(
  [selectPayableTotal, selectShippingFee],
  (payableTotal, shippingFee) => Math.round(payableTotal + shippingFee)
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