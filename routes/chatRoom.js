const express =  require('express');

const chatRoom = require('../service/chatRoom.js');

const router = express.Router();

router.get('/', chatRoom.getRecentConversation)
router.get('/:roomId', chatRoom.getConversationByRoomId)
router.post('/initiate', chatRoom.initiate)
router.post('/:roomId/message', chatRoom.postMessage)
router.put('/:roomId/mark-read', chatRoom.markConversationReadByRoomId)

module.exports = router