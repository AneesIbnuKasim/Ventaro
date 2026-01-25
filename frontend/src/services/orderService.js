import makeRequest from "../utils/apiClient";

export const orderAPI = {
  fetchOrder: (params={}) => {
    
    const urlParams = new URLSearchParams(params)
    return makeRequest({
      method: "get",
      url: `/api/orders?${urlParams.toString()}`,
    });
  },

  fetchSingleOrderThunk: (orderId) => {
    
    return makeRequest({
      method: "get",
      url: `/api/orders/${orderId}`,
    });
  },

  cancelOrder: (orderId) => {

    return makeRequest({
      method: "put",
      url: `/api/orders/${orderId}/cancel`,
      
    });
  },

  returnOrderRequest: (returnData) => {
    const { returnId:orderId, ...data } = returnData;
    
    return makeRequest({
      method: "put",
      url: `/api/orders/${orderId}/return`,
      data
    });
  },

};
