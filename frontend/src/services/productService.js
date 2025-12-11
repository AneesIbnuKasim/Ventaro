import axios from "axios";
import { makeRequest } from "../utils/apiClient";

export const productAPI = {
  getProductByCategory: (category, params = {}) => {
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
    const res = await axios.post("http://localhost:5001/api/product", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log('res in api', res);
    
    return res.data
  },

  updateProduct: (productId, editData) => {
    return makeRequest({
      method: "put",
      url: `api/product/${productId}`,
      data: editData,
    });
  },

  deleteProduct: (productId) => {
    return makeRequest({
      method: "delete",
      url: `api/product/${productId}`,
    });
  },

  //USER PRODUCT PAGES

  fetchSingleProduct: (productId) => {
    console.log('here');
    
    return makeRequest({
      method: "get",
      url: `api/product/${productId}`,
    });
  }
};
