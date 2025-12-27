import makeRequest from "../utils/apiClient";

export const orderAPI = {
  fetchOrder: (params={}) => {
    console.log('url params', params);
    
    const urlParams = new URLSearchParams(params)
    return makeRequest({
      method: "get",
      url: `/api/orders?${urlParams.toString()}`,
    });
  },

  fetchSingleOrderThunk: (orderId) => {
    console.log('in apo single', orderId);
    
    return makeRequest({
      method: "get",
      url: `/api/orders/${orderId}`,
    });
  },

  cancelOrder: (orderId) => {
    console.log("cancel in api call", orderId);

    return makeRequest({
      method: "put",
      url: `/api/orders/${orderId}/cancel`,
      
    });
  },

  returnOrderRequest: (returnData) => {
    console.log("returnData in api call", returnData);
    const { returnId:orderId, ...data } = returnData;
    console.log('orderId', orderId);
    console.log('data', data);
    
    return makeRequest({
      method: "put",
      url: `/api/orders/${orderId}/return`,
      data
    });
  },
};
