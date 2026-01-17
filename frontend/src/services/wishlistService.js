import ResetPassword from "../pages/ResetPassword";
import { makeRequest } from "../utils/apiClient";
import axios from "axios";

export const wishlistAPI = {
  //ADD/REMOVE FROM WISHLIST
  toggleWishlist: (data) => {
    const { productId } = data
    return makeRequest({
      method: "post",
      url: `api/user/wishlist/${productId}`
    });
  },
  
  //FETCH WISHLIST
  fetchWishlist: () => {
    return makeRequest({
      method: "get",
      url: `api/user/wishlist`
    });
  }
};
