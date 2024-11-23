const mongoose= require("mongoose")


const userModel= new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    subscription:{
        type:Object
    },
    email:{
        type:String,
    },
    password:{
        type: String,
        required: true
    },
    age:{
        type: Number
    },
    gender:{
        type: String,
    },
    mode:{
        default: "Solo Mode",
        type: String,
    },
    uid:{
        type:String,
    }
})

const User = mongoose.model("User", userModel);

module.exports = User;