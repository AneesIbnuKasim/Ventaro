import { makeRequest } from '../utils/apiClient'

export const adminAPI = {
    login: (credentials)=>{
        return makeRequest({
            method: 'post',
            url: 'api/admin/login',
            data: credentials
        })
    },

    
}