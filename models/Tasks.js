
import mongoose from  'mongoose' ;

const TaskSchema = new mongoose.Schema({

    title:{
        type: String,
         required: true,
    },

    description:{
        type:String,
        required:true
    },

    status:{
        type:String,
        required:true
    },

    priority:{

        type:String,
        required:true
    },

    assignee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }

} , {timestamps: true });

let TaskModel = mongoose.model('Tasks' , TaskSchema);

export default TaskModel;