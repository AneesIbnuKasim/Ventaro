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

    removeFromCart: (itemId) => {
        return makeRequest(({
            method: 'delete',
            url: `/api/cart/${itemId}`,
        }))
    },

    syncCart: (items) => {
        const data = items.map(i=>({
            productId: i.product._id,
            quantity: i.quantity
        }))

        console.log('date in api:', data);
        
        return makeRequest(({
            method: 'put',
            url: `/api/cart`,
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