const ChatRoomModel = require('../models/Chatroom')
const makeValidation = require('@withvoid/make-validation');
const ChatMessageModel = require('../models/ChatMessage');
const UserModel = require('../models/Users.js');
const initiate = async(req, res) => {
    try {
        const validation = makeValidation(types => ({
            payload: req.body,
            checks: {
              userIds: { 
                type: types.array, 
                options: { unique: true, empty: false, stringOnly: true } 
              }
            }
        }));
        
        if (!validation.success) return res.json({...validation} );  

        const {userIds} = req.body;
        const { userId: chatInitiator } = req;
        const allUserIds = [...userIds, chatInitiator];
        const chatRoom = await initiateChat(allUserIds, chatInitiator)
        return res.json({success : 1, message : chatRoom})
    } catch (error) {
        return res.json({success : 0, errorMessage : error.message})
    }
}
const postMessage = async(req, res) => {
    try {
        const { roomId } = req.params;
        const validation = makeValidation(types => ({
            payload: req.body,
            checks: {
              messageText: { type: types.string },
            }
        }));
        if (!validation.success) return res.json({ ...validation });
        const messagePayload = {
            messageText: req.body.messageText,
        };
        const currentLoggedUser = req.userId;
        const post = await createPostInChatRoom(roomId, messagePayload, currentLoggedUser);
        global.io.sockets.in(roomId).emit('new message', { message: post });
        return res.json({ success: 1, message : post });

    } catch (error) {
        return res.json({success : 0, errorMessage : error.message})
    }
}

const getConversationByRoomId = async(req, res) => {
    console.log("here")
    const {roomId} = req.params;
    const room = await getChatRoomByRoomId(roomId)

    if(!room) {
        return res.json({success : 0, errorMessage : "No room exists"})
    }
    const users = await getUserByIds(room.userIds);
    const options = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10,
    };
    const conversation = await ChatMessageModel.find({chatRoomId : roomId});
    return res.json({success: true,conversation,users,});
}


const initiateChat = async(userIds, chatInitiator) => {
    try {
        const availableRoom = await ChatRoomModel.findOne({
            userIds: {
              $size: userIds.length,
              $all: [...userIds],
            }
        });

        if (availableRoom) {
            return {
                success : 1,
                isNew: false,
                message: 'retrieving an old chat room',
                chatRoomId: availableRoom._doc._id
            };
        }

        const newRoom = await ChatRoomModel.create({ userIds, chatInitiator });
            return {
                success : 1,
                isNew: true,
                message: 'creating a new chatroom',
                chatRoomId: newRoom._doc._id
        };


    } catch (error) {
        return error.message
    }
}

const createPostInChatRoom = async(chatRoomId, message, postedByUser) => {
    try {
        const post = await ChatMessageModel.create({
            chatRoomId,
            message,
            postedByUser
        });
        console.log("inside createPostInChatRoom",post)
        const allPost = await ChatMessageModel.find({chatRoomId : chatRoomId});
        console.log(allPost)
        return allPost
      
    } catch (error) {
        return error
    }
}

const getChatRoomByRoomId = async(roomId)  => {
    try {
        const room  = await ChatRoomModel.findOne({_id : roomId})
        return room
    } catch (error) {
        return error
    }
}

const getUserByIds = async(ids) => {
    try {
        const users = UserModel.find({_id : {$in : ids}});
        return users
    } catch(error) {
        return error;
    }
}

module.exports = {
    initiate,
    postMessage,
    getConversationByRoomId,
}