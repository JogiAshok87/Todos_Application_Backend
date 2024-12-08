const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
        maxlength:100
    },
    description:{
        type:String,
        required: true
    },
    status:{
        type:String,
        enum:['TODO','IN_PROGRESS','COMPLETED'],
        default:'TODO'
    },
    priority:{
        type:String,
        enum : ['LOW','MEDIUM','HIGH']
    },
    createdAt:{
        type : Date,
        default:Date.now()
    },
    updatedAt:{
        type:Date,
        default: Date.now()
    }

    
})

module.exports = mongoose.model('TaskModel',taskSchema)