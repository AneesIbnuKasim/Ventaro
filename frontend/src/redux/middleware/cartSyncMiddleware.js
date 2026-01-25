import debounce from "lodash/debounce";
import cartAPI from '../../services/cartService'
import { useAdmin } from "../../context/AdminContext";

const syncCartDebounced = debounce(async (items, store) => {
  try {
    const res = await cartAPI.syncCart(items)

    //dispatch to update state as per returned data from BE
    // store.dispatch({
    //   type: 'cartSlice/cartSynced',
    //   payload: res.data
    // })
    //Rollback state to the initial if any error updating in BE
  } catch (err) {
    store.dispatch({
      type: 'cartSlice/cartSyncFailed',
      payload: err.message
    })
  }
}, 500);

export const cartSyncMiddleware = store => next => action => {
  const result = next(action);
  const { items } = store.getState().cart;

  switch (action.type) {
    case "cartSlice/updateQuantity":
      if (    action.meta?.isAuthenticated
 && items.length) {
        syncCartDebounced(items, store);
      }
      break;

    case 'cart/checkout':
      syncCartDebounced.flush();
      break;

    default:
      break;
  }

  return result;
};