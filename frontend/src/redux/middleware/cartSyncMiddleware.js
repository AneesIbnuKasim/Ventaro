import debounce from "lodash/debounce";
import cartAPI from '../../services/cartService'
import { useAdmin } from "../../context/AdminContext";

let isAuth
const syncCartDebounced = debounce(async (items) => {
  try {
    const { isAuthenticated } = useAdmin()
    isAuth = isAuthenticated
    await cartAPI.syncCart(items)
  } catch (err) {
    console.error("Cart sync failed", err);
  }
}, 1500);

export const cartSyncMiddleware = store => next => action => {
  const result = next(action);

  const { items } = store.getState().cart;

  switch (action.type) {
    case "cart/updateQuantity":
      if (isAuth && items.length) {
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