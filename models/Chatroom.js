const mongoose = require('mongoose');
const v1 = require('uuid')
const uuidv1 = v1
const {Schema} = mongoose
const chatRoomSchema = new Schema({
    userIds: Array,
    chatInitiator: String,
},
{
    timestamps: true,
    collection: "chatrooms",
}
    )

module.exports = mongoose.model('ChatRoom', chatRoomSchema)