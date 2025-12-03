import { makeRequest } from '../utils/apiClient'

export const adminAPI = {
    login: (credentials)=>{
        return makeRequest({
            method: 'post',
            url: 'api/admin/login',
            data: credentials
        })
    },

    getAllCategory: (params= {})=>{
        const { page, limit, search, status } = params
        const paramsData = new URLSearchParams({
            page,
            limit,
        })
        if (search) paramsData.append('search', search)
        if (status) paramsData.append('status', status)
        return makeRequest({
            method: 'get',
            url: `api/admin/category?${paramsData.toString()}`,
        })
    },

    addCategory: (categoryData)=>{

        return makeRequest({
            method: 'post',
            url: 'api/admin/category',
            data: categoryData
        })
    },

    updateCategory: (categoryId, editData)=>{

        return makeRequest({
            method: 'put',
            url: `api/admin/category/${categoryId}`,
            data: editData
        })
    },

    deleteCategory: (categoryId)=>{
        return makeRequest({
            method: 'delete',
            url: 'api/admin/category',
            data: categoryId
        })
    },

    
}