import makeRequest from "../utils/apiClient"

const chatAPI = {
    sendChatMessage: (message) => {
        return makeRequest({
            method: 'post',
            url: '/api/chat',
            data:{message}
        })
    }
}

export default chatAPI