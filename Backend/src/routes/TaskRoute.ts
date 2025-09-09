import express from 'express'
import authMiddleware from '../middleware/Auth.js'
import { createTask, deleteTask, getTask, getTaskbyId, updateTask } from '../controller/taskController.js'

const taskrouter = express.Router()
taskrouter.route('/Task')
.get(authMiddleware,getTask)
.post(authMiddleware,createTask)

taskrouter.route('/:id/Task')
.get(authMiddleware,getTaskbyId)
.put(authMiddleware,updateTask)
.delete(authMiddleware,deleteTask)

export default taskrouter