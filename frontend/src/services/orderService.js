import makeRequest from "../utils/apiClient"

export const orderAPI = {
    fetchOrder: () => {
        return makeRequest({
            method: 'get',
            url: '/api/orders'
        })
    },

    cancelOrder: (orderId) => {
        console.log('orderId in api call', orderId);
        
        return makeRequest({
            method: 'put',
            url: `/api/orders/${orderId}/cancel`
        })
    },

    returnOrder: (orderId) => {
        console.log('orderId in api call', orderId);
        
        return makeRequest({
            method: 'put',
            url: `/api/orders/${orderId}/return`
        })
    },


}