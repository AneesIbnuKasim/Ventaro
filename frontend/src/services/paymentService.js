import makeRequest from "../utils/apiClient"

export const paymentAPI = {
    createRazorpayOrder: (data) => {
        return makeRequest({
            method: 'post',
            url: `/api/payments/razorpay/create-order`,
            data
        })
    },

    //COD-WALLET ORDER
    createOrder: (data) => {
        return makeRequest({
            method: 'post',
            url: `/api/payments/create-order`,
            data
        })
    },

    verifyRazorpayOrder: (data) => {
        console.log('data in verify', data);
        
        return makeRequest({
            method: 'post',
            url: `/api/payments/razorpay/verify`,
            data
        })
    }
}

export default paymentAPI