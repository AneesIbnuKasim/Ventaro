import debounce from "lodash/debounce";
import cartAPI from '../../services/cartService'
import { useAdmin } from "../../context/AdminContext";

const syncCartDebounced = debounce(async (items) => {
  try {
    console.log('in sync cart debounced', items);
    await cartAPI.syncCart(items)
  } catch (err) {
    console.error("Cart sync failed", err);
  }
}, 1500);

export const cartSyncMiddleware = store => next => action => {
  const result = next(action);
  console.log('in sync cart debounced', action.meta);

  const { items } = store.getState().cart;

  switch (action.type) {
    case "cartSlice/updateQuantity":
      if (    action.meta?.isAuthenticated
 && items.length) {
        console.log('in sync cart calling', action.payload);
        
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