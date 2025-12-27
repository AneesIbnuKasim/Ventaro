import { createSelector } from "@reduxjs/toolkit"
import { COD_FEE, SHIPPING } from "../../config/app"


const selectOrder = (state) => state.order.selectedOrder

export const selectSubTotal = createSelector(
    [selectOrder],
    (order) => order?.items?.reduce((sum, item) => (
        sum+item.itemTotal
    ), 0)
)

export const selectCodFee = createSelector(
    [selectOrder],
    (order) => order?.paymentMethod === 'COD' ? COD_FEE : 0
)
export const selectShippingFee = createSelector(
    [selectSubTotal],
    (subTotal) => subTotal > SHIPPING.freeShippingThreshold ? 0 : SHIPPING.shippingFee
)



