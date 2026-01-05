import axios from 'axios';
import { makeRequest } from '../utils/apiClient'
import { API_CONFIG } from '../config/app';

export const adminAPI = {
    login: (credentials)=>{
        return makeRequest({
            method: 'post',
            url: 'api/admin/login',
            data: credentials
        })
    },

    getProfile: ()=>{
        return makeRequest({
            method: 'get',
            url: 'api/admin/me'
        })
    },

    //ADMIN PROFILE UPDATE
  updateProfile: (editData) => {
    return makeRequest({
      method: "put",
      url: "api/admin/profile",
      data: editData,
    });
  },

  //UPDATE ADMIN PROFILE AVATAR
  updateAvatar: async (formData) => {
    console.log("formdata", formData);

    const token = localStorage.getItem("adminToken");
    
    const res = await axios.put(
      "http://localhost:5001/api/admin/avatar",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  },

    // uploadImages: (formData)=>{
    //     return makeRequest({
    //         method: 'post',
    //         url: 'api/admin/upload-images',
    //         data: formData
    //     })
    // },

    getAllCategory: (params = {})=>{
        const { limit, page } = params
        console.log('last page, limit', limit, page);
        
        return makeRequest({
            method: 'get',
            url: `api/category`,
            params
        })
    },

    addCategory: async(categoryData)=>{

        const { name, description, image } = categoryData

        const formData = new FormData()

        formData.append('image', image)
        formData.append('description', description)
        formData.append('name', name)

        const token = localStorage.getItem("adminToken");
        
        const res = await axios.post(`http://localhost:5001/api/category`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data
    },

    updateCategory: (categoryId, editData)=>{

        return makeRequest({
            method: 'put',
            url: `api/category/${categoryId}`,
            data: editData
        })
    },

    deleteCategory: (categoryId)=>{
        return makeRequest({
            method: 'delete',
            url: `api/category/${categoryId}`,
        })
    },

    //ORDERS

    //fetch orders
    fetchOrder: (params={}) => {
    console.log('url params', params);
    
    const urlParams = new URLSearchParams(params)
    return makeRequest({
      method: "get",
      url: `/api/admin/orders?${urlParams.toString()}`,
    });
  },

  //update order status
    updateStatus: (orderData) => {
    console.log("returnData in api call", orderData);
    const { orderId, ...data } = orderData;
    
    return makeRequest({
      method: "put",
      url: `/api/admin/orders/${orderId}`,
      data
    });
  },

    
}