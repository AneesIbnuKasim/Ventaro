import debounce from "lodash.debounce";
import api from "@/utils/api";

const syncCartDebounced = debounce(async (items) => {
  try {
    await api.post("/cart/sync", {
      items: items.map(i => ({
        productId: i._id,
        quantity: i.quantity,
      })),
    });
  } catch (err) {
    console.error("Cart sync failed", err);
  }
}, 1500);

export const cartSyncMiddleware = store => next => action => {
  const result = next(action);

  const { isAuthenticated } = store.getState().auth;
  const { items } = store.getState().cart;

  switch (action.type) {
    case "cart/updateQuantity":
      if (isAuthenticated && items.length) {
        syncCartDebounced(items);
      }
      break;

    case "cart/checkout":
      syncCartDebounced.flush();
      break;

    default:
      break;
  }

  return result;
};