import { makeRequest } from '../utils/apiClient'

export const adminAPI = {
    login: (credentials)=>{
        return makeRequest({
            method: 'post',
            url: 'api/admin/login',
            data: credentials
        })
    },

    uploadImages: (formData)=>{
        return makeRequest({
            method: 'post',
            url: 'api/admin/upload-images',
            data: formData
        })
    },

    getAllCategory: (params= {})=>{
        const { page, limit, search } = params
        const paramsData = new URLSearchParams({
            page,
            limit,
        })
        if (search) paramsData.append('search', search)
        return makeRequest({
            method: 'get',
            url: `api/category?${paramsData.toString()}`,
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

    
}