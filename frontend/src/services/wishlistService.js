import ResetPassword from "../pages/ResetPassword";
import { makeRequest } from "../utils/apiClient";
import axios from "axios";

export const wishlistAPI = {
  //USER PROFILE SECTION
  toggleWishlist: (productId) => {
    
    return makeRequest({
      method: "post",
      url: `api/user/wishlist/${productId}`
    });
  },
};
