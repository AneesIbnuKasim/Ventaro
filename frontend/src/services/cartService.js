import makeRequest from "../utils/apiClient"

export default cartAPI = {
    fetchCart: () => {
        return makeRequest(({
            method: 'get',
            url: '/api/cart'
        }))
    },

    addToCart: (params={}) => {
        return makeRequest(({
            method: 'post',
            url: `/api/cart`,
            data
        }))
    },

    removeFromCart: (productId) => {
        return makeRequest(({
            method: 'delete',
            url: `/api/cart/${productId}`,
        }))
    },

    syncCart: (data) => {
        return makeRequest(({
            method: 'put',
            url: `/api/cart/update`,
            data
        }))
    },

    clearCart: () => {
        return makeRequest(({
            method: 'delete',
            url: `/api/cart/clear`
        }))
    },
    

}