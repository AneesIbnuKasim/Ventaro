import { useLocation } from "react-router-dom";
import makeRequest from "../utils/apiClient";
import axios from "axios";

const bannerAPI = {
  fetchBanner: (params = {}) => {
    const urlParams = new URLSearchParams(params);

    return makeRequest({
      method: "get",
      url: `/api/banner?${urlParams.toString()}`,
    });
  },

  createBanner: async (data = {}) => {
    const { title, subTitle, urlLink, position, isActive, order, image } = data;

    const formData = new FormData();

    formData.append("image", image);
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("urlLink", urlLink);
    formData.append("position", position);
    formData.append("isActive", isActive);
    formData.append("order", order);

    const token = localStorage.getItem("adminToken");

    const res = await axios.post(`http://localhost:5001/api/banner`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  },

  updateBanner: async({ bannerId, values }) => {
  const formData = new FormData()

  // append TEXT fields only
  Object.entries(values).forEach(([key, value]) => {
    if (key !== 'image' && value !== undefined && value !== null) {
      formData.append(key, value)
    }
  })

  // append FILE only if present
  if (values.image instanceof File) {
    formData.append('image', values.image)
  }

  const res = await axios.put(
    `http://localhost:5001/api/banner/${bannerId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
      }
    }
  )

  return res.data
},

  removeBanner: (bannerId) => {
    console.log("coup:", bannerId);

    return makeRequest({
      method: "delete",
      url: `/api/banner/${bannerId}`,
    });
  },
};

export default bannerAPI;
