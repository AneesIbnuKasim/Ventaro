import { makeRequest } from '../utils/apiClient'

export const adminAPI = {
    login: (credentials)=>{
        return makeRequest({
            method: 'post',
            url: 'api/admin/login',
            data: credentials
        })
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

    addCategory: (categoryData)=>{

        return makeRequest({
            method: 'post',
            url: 'api/category',
            data: categoryData
        })
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

    
}