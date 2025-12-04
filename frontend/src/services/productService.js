import { makeRequest } from '../utils/apiClient'

export const productAPI = {
    getAllProduct: (params= {})=>{
        const { page, limit, search, sortBy, sortOrder, category, rating, minPrice=0, maxPrice,  } = params
        const paramsData = new URLSearchParams({
            page,
            limit,
        })
        console.log('get produccts');
        
        if (search) paramsData.append('search', search)
        return makeRequest({
            method: 'get',
            url: `api/product?${paramsData.toString()}`,
        })
    },

    addProduct: (productData)=>{

        return makeRequest({
            method: 'post',
            url: 'api/product',
            data: productData
        })
    },

    updateProduct: (productId, editData)=>{

        return makeRequest({
            method: 'put',
            url: `api/product/${productId}`,
            data: editData
        })
    },

    deleteProduct: (productId)=>{
        return makeRequest({
            method: 'delete',
            url: `api/product/${productId}`,
        })
    },

    
}