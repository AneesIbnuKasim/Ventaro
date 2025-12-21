import debounce from "lodash/debounce";
import cartAPI from '../../services/cartService'
import { useAdmin } from "../../context/AdminContext";

const syncCartDebounced = debounce(async (items, store) => {
  try {
    console.log('in sync cart debounced', items);
    const res = await cartAPI.syncCart(items)

    //dispatch to update state as per returned data from BE
    store.dispatch({
      type: 'cartSlice/cartSynced',
      payload: res.data
    })
    //Rollback state to the initial if any error updating in BE
  } catch (err) {
    store.dispatch({
      type: 'cartSlice/cartSyncFailed',
      payload: err.message
    })
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
        
        syncCartDebounced(items, store);
      }
      break;

    case action.type === 'cart/checkout':
      syncCartDebounced.flush();
      break;

    default:
      break;
  }

  return result;
};