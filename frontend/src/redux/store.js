import { configureStore } from "@reduxjs/toolkit";
import { cartPersistenceMiddleware } from "./middleware/addToLocalStorage";
import { cartSyncMiddleware } from "./middleware/cartSyncMiddleware";
import cartReducer from './slices/cartSlice'
import couponReducer from './slices/couponSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    coupon: couponReducer
  },
  middleware: (getDefault) =>
    getDefault().concat(
      cartPersistenceMiddleware,
      cartSyncMiddleware
    ),
})