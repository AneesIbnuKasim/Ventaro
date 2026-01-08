import makeRequest from "../utils/apiClient"

export const dashboardAPI = {
    fetchSalesReport: (query={}) => {
        const urlQuery = new URLSearchParams(query)
        console.log('query in api service', urlQuery)
        return makeRequest({
            method: 'get',
            url: `/api/analytics?${urlQuery.toString()}`,
        })
    }
}