const express =  require("express");
const ChatController =  require("../controllers/ChatController.js");

const router = express.Router();

router.post("/", ChatController.chatHandler);

module.exports = router;