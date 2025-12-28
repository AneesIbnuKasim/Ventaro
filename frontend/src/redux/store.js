import { configureStore } from "@reduxjs/toolkit";
import { cartPersistenceMiddleware } from "./middleware/addToLocalStorage";
import { cartSyncMiddleware } from "./middleware/cartSyncMiddleware";
import cartReducer from './slices/cartSlice'
import couponReducer from './slices/couponSlice'
import checkoutReducer from './slices/checkoutSlice'
import orderReducer from './slices/orderSlice'
import salesReducer from './slices/salesSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    coupon: couponReducer,
    checkout: checkoutReducer,
    order: orderReducer,
    sales: salesReducer
  },
  middleware: (getDefault) =>
    getDefault().concat(
      cartPersistenceMiddleware,
      cartSyncMiddleware
    ),
})