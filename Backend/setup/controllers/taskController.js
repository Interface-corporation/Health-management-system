
import TasksModel from "../../initialization/task.js";

// create tasks
export const CreateTasks = async (req,res)=>{
   
    const{title,description,status,priority,assigne,due_date, progress,comment}= req.body

    try {
        const task= await TasksModel.create({title,description,status,priority,assigne,due_date, progress,comment});
        res.status(200).json({message:'task created successfully', task})
    } catch (error) {
        res.status(500).json('error occured while creating tasks');
        console.log('error is', error)
    }
}

// get all tasks

export const getAllTask = async (req,res)=>{
   
    try {
        const task = await TasksModel.findAll();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json('error occured getting all tasks');
        console.log('error is ', error)
    }
}

// get task by id 

export const getTaskById = async(req,res)=>{
    try {
        const task = await TasksModel.findByPk(req.params.id);
        if(!task) return res.json('user not found');

        res.json(task);

    } catch (error) {
        
        res.status(500).json('error occuring while getting user by id');
        console.log('error occured are ', error);
    }
}

// delete task

export const deleteTask = async(req,res)=>{

    try {
        const task = await TasksModel.findByPk(req.params.id);
        if(!task) return res.json('user not found');

        await task.destroy();

        res.json('Task deleted successfully')
    } catch (error) {
        res.status(500).json('error occuring while deleting task');
        console.log('error occured is', error)
    }
}

// update Task

export const updateTask = async (req,res)=>{

    try {
        const task = await TasksModel.findByPk(req.params.id);
        if(!task) return res.json('user not found');

        await task.update(req.body);

        res.json({message:'task updated successfully', task})

    } catch (error) {
        
        res.json('error occured while updating task')
        console.log('error occured is', error)
    }
}