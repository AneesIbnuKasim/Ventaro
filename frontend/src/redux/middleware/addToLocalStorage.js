export const cartPersistenceMiddleware = store => next => action => {
  const result = next(action);

  if (action.type.startsWith("cart/")) {
    const cart = store.getState().cart;
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  return result;
};