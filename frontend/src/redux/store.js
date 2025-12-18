import { configureStore } from "@reduxjs/toolkit";
import { cartPersistenceMiddleware } from "./middleware/addToLocalStorage";
import { cartSyncMiddleware } from "./middleware/cartSyncMiddleware";

export const store = configureStore({
  reducer: {
    cart: cartReducer
  },
  middleware: (getDefault) =>
    getDefault().concat(
      cartPersistenceMiddleware,
      cartSyncMiddleware
    ),
});