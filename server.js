import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { notFoundHandler, globalErrorHandler } from './utils/errorHandler.js';
import usersRoute from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import {
  shutdownEmailService,
  getEmailQueueStats
} from './services/emailService.js';

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully.');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
};

// Initialize MongoDB connection
connectToMongoDB();

// Define a route in Express
app.get('/', (req, res) => {
  res.send('<h1>Hello server!</h1>');
});

// Use routes
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoutes);

// Add a route to check email queue status (optional)
app.get('/api/email/status', (req, res) => {
  const stats = getEmailQueueStats();
  res.json(stats);
});

// Use error-handling middleware
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Graceful shutdown handling
const gracefulShutdown = async () => {
  console.log('Starting graceful shutdown...');
  server.close(() => console.log('HTTP server closed.'));
  await shutdownEmailService();
  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);