import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { notFoundHandler, globalErrorHandler } from './utils/errorHandler.js'
// import usersRoute from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import userRoutes from './routes/userRoutes.js'
import connectDB from './config/db.js'

dotenv.config()

const app = express()

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'This is the main page of the authentication API'
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/task', taskRoutes)
app.use('/api/user', userRoutes)

// Use error-handling middleware
app.use(notFoundHandler)
app.use(globalErrorHandler)

// Start the server
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// Graceful shutdown handling
const gracefulShutdown = async () => {
  console.log('Starting graceful shutdown...')
  server.close(() => console.log('HTTP server closed.'))
  await mongoose.connection.close()
  console.log('MongoDB connection closed.')
  process.exit(0)
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
