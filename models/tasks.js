import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    isCompleted : {
        type : Boolean,
        default : false
    }
})

export const taskmodel = mongoose.model("task", taskSchema)