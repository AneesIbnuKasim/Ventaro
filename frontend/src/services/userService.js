import ResetPassword from '../pages/ResetPassword'
import { makeRequest } from '../utils/apiClient'

export const userAPI = {
    //USER PROFILE SECTION
    updateProfile: (editData)=>{
        return makeRequest({
            method: 'put',
            url: 'api/user/profile',
            data: editData
        })
    },
    //GET PROFILE DETAILS
    getProfile: (editData)=>{
        console.log('editData', editData);
        
        return makeRequest({
            method: 'get',
            url: 'api/user/me',
        })
    },



}