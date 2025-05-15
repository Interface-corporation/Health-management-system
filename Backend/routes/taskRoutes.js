
import { CreateTasks,getAllTask ,getTaskById , deleteTask ,updateTask} from "../setup/controllers/taskController.js";
import express from "express";


const route = express.Router()
 
route.post('/post',CreateTasks);
route.get('/get',getAllTask)
route.get('/:id', getTaskById);
route.delete('/:id',deleteTask);
route.put('/:id',updateTask);


export default route