import makeRequest from "../utils/apiClient"

const chatAPI = {
    sendChatMessage: (message) => {
        console.log('message in service', message);
        
        return makeRequest({
            method: 'post',
            url: '/api/chat',
            data:{message}
        })
    }
}

export default chatAPI