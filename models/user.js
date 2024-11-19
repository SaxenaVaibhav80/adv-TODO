const mongoose= require("mongoose")


const userModel= new mongoose.Schema({
    username:{
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
    }
})

const User = mongoose.model("User", userModel);

module.exports = User;