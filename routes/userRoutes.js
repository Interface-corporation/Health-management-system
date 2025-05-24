// routes/userRoutes.js
import express from 'express'
import {
  getUserbyTask,
  DeleteUser,
  getAllUser,
  UpdateUser
} from '../controllers/userController.js'

const Router = express.Router()

Router.get('/getTask/:id', getUserbyTask)

Router.get('/allUser', getAllUser)

Router.delete('/deleteUser/:id', DeleteUser)

Router.put('/updateUser/:id', UpdateUser)

export default Router
