import makeRequest from "../utils/apiClient"

export const paymentAPI = {
    createRazorpayOrder: (data) => {
        return makeRequest({
            method: 'post',
            url: `/api/payment/razorpay/create-order`,
            data
        })
    }
}

export default paymentAPI