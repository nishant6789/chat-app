const mongoose = require('mongoose');
const v1 = require('uuid')
const uuidv1 = v1
const {Schema} = mongoose
const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    username : {
        type : String,
        require : true
    },
    password : {
        type : String,
        require : true
    },

},
{
    timestamps: true,
    collection: "users",
}
    )

module.exports = mongoose.model('User', userSchema)