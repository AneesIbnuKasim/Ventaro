// useWishlist.js
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlistThunk } from "../redux/slices/wishlistSlice";

export const useWishlist = (productId) => {
  const dispatch = useDispatch();
  const ids = useSelector((state) => state.wishlist.ids);

  console.log('ids', ids);
  

  return {
    isWishlisted: ids.includes(productId),
    toggle: () => dispatch(toggleWishlistThunk(productId)),
  };
};