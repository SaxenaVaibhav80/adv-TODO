
const mongoose = require('mongoose');

const taskModel = new mongoose.Schema({
    userid: {
        type: String,
        required: true 
    },
    current:
    {
        date:{
         type:String,
         default:null
        },
        name:{
         type:String
        },
        tasks:[
            {
                title: {
                    type: String,
                    required: true 
                },
                data: {
                    type: String, 
                    required: true
                },
                imgUrl: {
                    type: String
                },
                created_at: {
                    type:String 
                },
                status:{
                    type:String,
                    default:"pending"
                },
                priority:{
                    type:String,
                    default:"moderate"
                },
                
            }
        ],
        progress:{
            type:Number,
            default:0
        },
    } ,
    history: [
        {
            date: {
                type: String,
                required: true 
            },
            data: [
               
            ],
        }
    ],

    
});

const Task = mongoose.model("Task", taskModel);
module.exports = Task