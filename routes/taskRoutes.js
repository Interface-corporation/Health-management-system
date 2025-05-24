import express from 'express'
import {
  CreateTask,
  getAllTasks,
  getTaskById,
  DeletTask,
  updateTask
} from '../controllers/taskController.js'

const router = express.Router()

router.post('/task', CreateTask)

router.get('/getAll', getAllTasks)

router.get('/getById/:id', getTaskById)

router.delete('/deleteTask/:id', DeletTask)

router.put('/updateTask/:id', updateTask)

export default router
