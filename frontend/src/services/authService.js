import { makeRequest } from '../utils/apiClient'

export const authAPI = {
    register: async(userData)=>{
        return makeRequest({
            method: 'post',
            url: '/api/auth/register',
            data: userData
        })
    },

    login: (credentials)=>{
        return makeRequest({
            method: 'post',
            url: 'api/auth/login',
            data: credentials
        })
    }
}