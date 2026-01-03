// // checkoutSelectors.js
// import { createSelector } from "@reduxjs/toolkit";
// import { COD_FEE } from "../../config/app";
// import { selectGrandTotal } from "./cartSelector";

// export const selectPaymentMethod = (state) => state.checkout.paymentMethod;

// export const selectCodFee = createSelector(
//   [selectPaymentMethod],
//   (method) => (method === "COD" ? COD_FEE : 0)
// );

// export const selectFinalPayable = createSelector(
//   [selectGrandTotal, selectCodFee],
//   (grandTotal, codFee) => grandTotal + codFee
// );

// export const checkoutTotal = createSelector(
//     [selectCodFee, selectFinalPayable],
//     (codFee, finalPayable) => ({
//         codFee,
//         finalPayable
//     })
// )





import { createSelector } from "@reduxjs/toolkit";
import { SHIPPING, COD_FEE } from "../../config/app";
import { selectAppliedCoupon, selectCartItems } from "./cartSelector";

export const selectCheckoutItems = (state) => state.checkout.items;
export const selectPaymentMethod = (state) => state.checkout.paymentMethod;

/* ---------- SUBTOTAL ---------- */
export const selectSubTotal = createSelector(
  [selectCheckoutItems],
  (items) =>
    items.reduce(
      (sum, item) => sum + (item.finalUnitPrice ?? item.sellingPrice) * item.quantity,
      0
    )
);

/* ---------- DISCOUNT ---------- */
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
        if (coupon.applicableCategories.length) {

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

        return discount
    
  }
);

/* ---------- PAYABLE ---------- */
export const selectPayableTotal = createSelector(
  [selectSubTotal, selectDiscountTotal],
  (subTotal, discount) => Math.max(0, subTotal - discount)
);

/* ---------- SHIPPING ---------- */
export const selectShippingFee = createSelector(
  [selectPayableTotal],
  (payableTotal) =>
    payableTotal > SHIPPING.freeShippingThreshold ? 0 : SHIPPING.shippingFee
);

/* ---------- COD ---------- */
export const selectCodFee = createSelector(
  [selectPaymentMethod],
  (method) => (method === "COD" ? COD_FEE : 0)
);

/* ---------- GRAND TOTAL ---------- */
export const selectGrandTotal = createSelector(
  [selectPayableTotal, selectShippingFee, selectCodFee],
  (payable, shipping, cod) => payable + shipping + cod
);

/* ---------- AGGREGATE ---------- */
export const selectCheckoutTotals = createSelector(
  [
    selectCheckoutItems,
    selectSubTotal,
    selectDiscountTotal,
    selectPayableTotal,
    selectShippingFee,
    selectCodFee,
    selectGrandTotal,
  ],
  (
    items,
    subTotal,
    discountTotal,
    payableTotal,
    shippingFee,
    codFee,
    grandTotal
  ) => ({
    items,
    subTotal,
    discountTotal,
    payableTotal,
    shippingFee,
    codFee,
    grandTotal,
  })
);