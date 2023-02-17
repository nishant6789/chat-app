const mongoose = require('mongoose');
var uuid = require('random-uuid-v4');
var uuidv4 = uuid();

const {Schema} = mongoose
const chatMessageSchema = new Schema({

    chatRoomId: String,
    message: mongoose.Schema.Types.Mixed,
    postedByUser : String
},
{
    timestamps: true,
    collection: "chatmessages",
}
    )

    chatMessageSchema.statics.createPostInChatRoom = async function (chatRoomId, message, postedByUser) {
        try {
          const post = await this.create({
            chatRoomId,
            message,
            postedByUser,
            readByRecipients: { readByUserId: postedByUser }
          });
          const aggregate = await this.aggregate([
            // get post where _id = post._id
            { $match: { _id: post._id } },
            // do a join on another table called users, and 
            // get me a user whose _id = postedByUser
            {
              $lookup: {
                from: 'users',
                localField: 'postedByUser',
                foreignField: '_id',
                as: 'postedByUser',
              }
            },
            { $unwind: '$postedByUser' },
            // do a join on another table called chatrooms, and 
            // get me a chatroom whose _id = chatRoomId
            {
              $lookup: {
                from: 'chatrooms',
                localField: 'chatRoomId',
                foreignField: '_id',
                as: 'chatRoomInfo',
              }
            },
            { $unwind: '$chatRoomInfo' },
            { $unwind: '$chatRoomInfo.userIds' },
            // do a join on another table called users, and 
            // get me a user whose _id = userIds
            {
              $lookup: {
                from: 'users',
                localField: 'chatRoomInfo.userIds',
                foreignField: '_id',
                as: 'chatRoomInfo.userProfile',
              }
            },
            { $unwind: '$chatRoomInfo.userProfile' },
            // group data
            {
              $group: {
                _id: '$chatRoomInfo._id',
                postId: { $last: '$_id' },
                chatRoomId: { $last: '$chatRoomInfo._id' },
                message: { $last: '$message' },
                type: { $last: '$type' },
                postedByUser: { $last: '$postedByUser' },
                readByRecipients: { $last: '$readByRecipients' },
                chatRoomInfo: { $addToSet: '$chatRoomInfo.userProfile' },
                createdAt: { $last: '$createdAt' },
                updatedAt: { $last: '$updatedAt' },
              }
            }
          ]);
          return aggregate[0];
        } catch (error) {
          throw error;
        }
      }

module.exports = mongoose.model('chatmessages', chatMessageSchema)

