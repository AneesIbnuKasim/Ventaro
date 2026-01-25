import makeRequest from "../utils/apiClient"

export const dashboardAPI = {
    fetchSalesReport: (query={}) => {
        const urlQuery = new URLSearchParams(query)
        return makeRequest({
            method: 'get',
            url: `/api/analytics?${urlQuery.toString()}`,
        })
    }
}