const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    profilePicture : {
        type : String,
        default : ""
    },
    coverPicture : {
        type: String,
        default : ""
    },
    follower : {
        type : Array,
        default : []
    },
    following : {
        type : Array,
        default : []
    }
},
{
    timestamps : true
})

module.exports = mongoose.model('User',userSchema)