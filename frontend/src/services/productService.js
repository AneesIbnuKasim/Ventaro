import axios from "axios";
import { makeRequest } from "../utils/apiClient";

export const productAPI = {
  getAllProduct: (params = {}) => {
    console.log("get all products:", params);

    return makeRequest({
      method: "get",
      url: `api/products`,
      params,
    });
  },

  fetchProductByCategory: (category, params = {}) => {
    console.log("search in api:", params);

    return makeRequest({
      method: "get",
      url: `api/products/${category}`,
      params,
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
    const res = await axios.post("http://localhost:5001/api/products", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return res.data
  },

  updateProduct: (productId, editData) => {
    return makeRequest({
      method: "put",
      url: `api/products/${productId}`,
      data: editData,
    });
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
    console.log('here', data);
    
    return makeRequest({
      method: "get",
      url: `api/products/details/${productId}`,
      params: {userId}
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

  console.log(params);
  
  return makeRequest({
      method: "get",
      url: `api/products/suggestions`,
      params
    });
 },

  //GLOBAL SEARCH 
 fetchSearch: (params) => {

  console.log('search para:',params);
  
  return makeRequest({
      method: "get",
      url: `api/search`,
      params
    });
 }
};
