import axios from "axios";
import { makeRequest } from "../utils/apiClient";
import { API_CONFIG } from "../config/app";

export const productAPI = {
  getAllProduct: (params = {}) => {
    return makeRequest({
      method: "get",
      url: `api/products`,
      params,
    })
  },

  fetchProductByCategory: (category, params = {}) => {
    return makeRequest({
      method: "get",
      url: `api/products/${category}`,
      params,
    });
  },

  //FETCH SLIDER PRODUCTS FOR HOME PAGE
  fetchHomePageProducts: () => {
    return makeRequest({
      method: "get",
      url: `api/products/featured`,
    });
  },

  addProduct: async(productData) => {
    const formData = new FormData();

    // Append all non-file fields
    Object.keys(productData).forEach((key) => {
      if (key !== "images") {
        formData.append(key, productData[key]);
      }
    });

    // Append images array
    productData.images.forEach((img) => {
      formData.append("images", img); // "images"
    });

    const token = localStorage.getItem("adminToken");
    
    const res = await axios.post(`${API_CONFIG.baseURL}/api/products`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return res.data
  },

  updateProduct: async(id, editData) => {

    const formData = new FormData();

    // Append all non-file fields
    Object.keys(editData).forEach((key) => {
      if (key !== "images" && key !== "prevImages") {
        
        formData.append(key, editData[key]);
      }
    });

    // Append images array
    editData.images.forEach((img) => {
      formData.append("images", img); // "images"
    });

    // Append prev images array
    editData.prevImages.forEach((img) => {
      formData.append("prevImages[]", JSON.stringify(img))
    });

    const token = localStorage.getItem("adminToken");
    
    const res = await axios.put(`${API_CONFIG.baseURL}/api/products/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return res.data
  },

  deleteProduct: (productId) => {
    return makeRequest({
      method: "delete",
      url: `api/products/${productId}`,
    });
  },

  //USER PRODUCT PAGES
  fetchSingleProduct: (data) => {
    const { productId, userId } = data
    
    return makeRequest({
      method: "get",
      url: `api/products/details/${productId}`,
      params: {userId}
    });
  },

  //TOGGLE PRODUCT STATUS
  toggleProductStatus: (productId) => {

    return makeRequest({
      method: "patch",
      url: `api/products/${productId}`,
    });
  },

  //SUBMIT USER REVIEW FOR PRODUCT
  submitReview: (reviewData) => {
    const { id:productId, ...data } = reviewData
    
    return makeRequest({
      method: "post",
      url: `api/products/details/${productId}`,
      data
    });
  },

  //SEARCH SUGGESTION 
 searchSuggestion: (params) => {

  return makeRequest({
      method: "get",
      url: `api/products/suggestions`,
      params
    });
 },

  //GLOBAL SEARCH 
 fetchSearch: (params) => {

  return makeRequest({
      method: "get",
      url: `api/search`,
      params
    });
 }
};
