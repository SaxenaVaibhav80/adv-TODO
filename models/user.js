const mongoose= require("mongoose")

const userModel = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    subscription: {
        type: Object 
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    mode: {
        type: String,
        default: "Solo Mode" 
    },
    roomId: {
        type: String, 
        default: null 
    },
    joinId:{
        type: String, 
        default: null 
    }
});


const User = mongoose.model("User", userModel);

module.exports = User;