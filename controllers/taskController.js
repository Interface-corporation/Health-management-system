import TaskModel from "../models/Tasks.js";


const CreateTask = async (req, res, next) => {
  const { title, description, status, priority, assignee } = req.body;

  try {
    const task = await TaskModel.create({ title, description, status, priority, assignee });
    res.status(201).json({ message: 'task created successfully', task });
  } catch (error) {
    next(error);
  }
};


const getAllTasks = async (req, res, next) => {
  try {
    const task = await TaskModel.find();
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req,res ,next)=>{

  const{id}=req.params ;

  try {
    const task = await TaskModel.findById(id);
    if(!task){
      res.status(404).json({message:'task not found'});
    }

    res.status(200).json(task)

  } catch (error) {
    next(error)
  }

}

const DeletTask = async (req,res,next)=>{

  const {id} = req.params;

  try {

    const task = await TaskModel.findByIdAndDelete(id);
    if(!task){
      res.status(404).json({message:'task not found'})
    }

    res.json({message:'task deleted successfully'})
  } catch (error) {
    
    next(error)
  }
}


const updateTask = async(req,res,next)=>{

  const{id}= req.params ;
  const updateData = req.body;

  try {
    const task = await TaskModel.findByIdAndUpdate(id,updateData,{
      new:true,
      runValidators:true
    })

    if(!task){
      res.status(404).json({message:'task not found'});
    }

    res.json(task);

  } catch (error) {
    
    next(error)
  }

}


export { CreateTask, getAllTasks , getTaskById , DeletTask , updateTask};
