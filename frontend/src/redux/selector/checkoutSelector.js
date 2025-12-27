// checkoutSelectors.js
import { createSelector } from "@reduxjs/toolkit";
import { COD_FEE } from "../../config/app";
import { selectGrandTotal } from "./cartSelector";

export const selectPaymentMethod = (state) => state.checkout.paymentMethod;

export const selectCodFee = createSelector(
  [selectPaymentMethod],
  (method) => (method === "COD" ? COD_FEE : 0)
);

export const selectFinalPayable = createSelector(
  [selectGrandTotal, selectCodFee],
  (grandTotal, codFee) => grandTotal + codFee
);

export const checkoutTotal = createSelector(
    [selectCodFee, selectFinalPayable],
    (codFee, finalPayable) => ({
        codFee,
        finalPayable
    })
)