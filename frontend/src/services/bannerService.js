import { useLocation } from "react-router-dom";
import makeRequest from "../utils/apiClient";
import axios from "axios";
import { API_CONFIG } from "../config/app";

const bannerAPI = {
  fetchBanner: (params = {}) => {
    const urlParams = new URLSearchParams(params);

    return makeRequest({
      method: "get",
      url: `/api/banner?${urlParams.toString()}`,
    });
  },

  createBanner: async (data = {}) => {
    const { title, subTitle, linkType, linkValue, position, status, order, image } = data;

    const formData = new FormData();

    formData.append("image", image);
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("linkValue", linkValue);
    formData.append("linkType", linkType);
    formData.append("position", position);
    formData.append("status", status);
    formData.append("order", order);

    const token = localStorage.getItem("adminToken");

    const res = await axios.post(API_CONFIG.baseURL, formData, {
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
    `${API_CONFIG.baseURL}/api/banner/${bannerId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
      }
    }
  )

  return res.data
},

  deleteBanner: (bannerId) => {
    return makeRequest({
      method: "delete",
      url: `/api/banner/${bannerId}`,
    });
  },

  toggleStatus: (bannerId) => {
    return makeRequest({
      method: "patch",
      url: `/api/banner/${bannerId}`,
    });
  },
};

export default bannerAPI;
