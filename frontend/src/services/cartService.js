import makeRequest from "../utils/apiClient"

const cartAPI = {
    fetchCart: () => {
        return makeRequest(({
            method: 'get',
            url: '/api/cart'
        }))
    },

    addToCart: (data={}) => {
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

    syncCart: (items) => {
        const data = items.map(i=>({
            productId: i._id,
            quantity: i.quantity
        }))
        return makeRequest(({
            method: 'put',
            url: `/api/cart/sync`,
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

export default cartAPI