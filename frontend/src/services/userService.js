import ResetPassword from "../pages/ResetPassword";
import { makeRequest } from "../utils/apiClient";
import  axios  from "axios";

export const userAPI = {
  //USER PROFILE SECTION
  updateProfile: (editData) => {
    return makeRequest({
      method: "put",
      url: "api/user/profile",
      data: editData,
    });
  },

  //GET PROFILE DETAILS
  getProfile: (editData) => {
    console.log("editData", editData);

    return makeRequest({
      method: "get",
      url: "api/user/me",
    });
  },

  
  //UPDATE USER PROFILE AVATAR
  updateAvatar: async (formData) => {
      console.log('formdata', formData);
      
      const token = localStorage.getItem("authToken");
      const res = await axios.put(
          "http://localhost:5001/api/user/avatar",
          formData,
          {
              headers: {
                  Authorization: `Bearer ${token}`,
                },
            }
        );
        
        return res.data;
    },

    addAddress: (addressData) => {
      console.log("editData", addressData);
  
      return makeRequest({
        method: "post",
        url: "api/user/addresses",
        data: addressData
      });
    },
};
