import makeRequest from "../utils/apiClient"

const couponAPI = {
    fetchCoupon: () => {
        return makeRequest(({
            method: 'get',
            url: '/api/coupon'
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

    removeCoupon: (itemId) => {
        return makeRequest(({
            method: 'delete',
            url: `/api/coupon/${itemId}`,
        }))
    },
    
}

export default couponAPI