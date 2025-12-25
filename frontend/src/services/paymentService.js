import makeRequest from "../utils/apiClient"

export const paymentAPI = {
    createRazorpayOrder: (data) => {
        return makeRequest({
            method: 'post',
            url: `/api/payments/razorpay/create-order`,
            data
        })
    },

    verifyRazorpayOrder: (data) => {
        console.log('daata in verufy', data);
        
        return makeRequest({
            method: 'post',
            url: `/api/payments/razorpay/verify`,
            data
        })
    }
}
