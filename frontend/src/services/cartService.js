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

    //validate and apply coupon
    applyCoupon: (data) => {
        return makeRequest(({
            method: 'post',
            url: `/api/cart/apply-coupon`,
            data
        }))
    },

    //remove coupon
    removeCoupon: () => {
        return makeRequest(({
            method: 'delete',
            url: `/api/cart/remove-coupon`,
        }))
    },
    
}

export default cartAPI