import { useLocation } from "react-router-dom"
import makeRequest from "../utils/apiClient"

const couponAPI = {
    
    fetchCoupon: (params= {}) => {
        
        const urlParams = new URLSearchParams(params)
        
        return makeRequest(({
            method: 'get',
            url: `/api/coupon?${urlParams.toString()}`
        }))
    },

    addCoupon: (data={}) => {
        return makeRequest(({
            method: 'post',
            url: `/api/coupon`,
            data
        }))
    },

    editCoupon: (couponId, data={}) => {
        return makeRequest(({
            method: 'put',
            url: `/api/coupon/${couponId}`,
            data
        }))
    },

    removeCoupon: (couponId) => {
        console.log('coup:', couponId);
        
        return makeRequest(({
            method: 'delete',
            url: `/api/coupon/${couponId}`,
        }))
    },
    
}

export default couponAPI