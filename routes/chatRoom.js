const express =  require('express');

const chatRoom = require('../service/chatRoom.js');

const router = express.Router();

router.get('/:roomId', chatRoom.getConversationByRoomId)
router.post('/initiate', chatRoom.initiate)
router.post('/:roomId/message', chatRoom.postMessage)


module.exports = router