const BaseController = require("./baseController");
const ChatService = require("../services/ChatService");

class ChatController extends BaseController {
    static chatHandler = BaseController.asyncHandler(async(req, res) => {
        console.log('messages in controller', req.body);
        
        const message = await ChatService.chatHandler(req.body.message)
        BaseController.logAction('CHAT-SEND')
        BaseController.sendSuccess(res, 'Chat send successfully', {from: 'system', id: Date.now(), ...message}, 200)
    })
}

module.exports = ChatController