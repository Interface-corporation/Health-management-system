// server.js - Updated with auth routes
import express from 'express';
const app = express();
// import middleware from './configuration/middleware.js';
import { notFoundHandler, globalErrorHandler } from './utils/errorHandler.js';
import usersRoute from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import sequelize from './models/index.js';
import {
  // initEmailService,
  shutdownEmailService,
  getEmailQueueStats
} from './services/emailService.js';

// Initialize Sequelize with the database configuration

// defining a route in Express
app.get('/', (req, res) => {
  res.send('<h1>Hello server!</h1>');
});

// apply middleware
// middleware(app);

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

// Initialize email service and start server
(async () => {
  try {
    // Initialize email service first
    // await initEmailService();

    // Then synchronize database models
    await sequelize.sync();
    console.log('Database models synchronized successfully.');

    // Start the server
    const port = process.env.PORT || 3000;
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Graceful shutdown handling
    const gracefulShutdown = async () => {
      console.log('Starting graceful shutdown...');

      // Close HTTP server
      server.close(() => {
        console.log('HTTP server closed.');
      });

      // Shutdown email queue
      await shutdownEmailService();

      // Close database connection
      await sequelize.close();
      console.log('Database connection closed.');

      process.exit(0);
    };

    // Listen for termination signals
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (err) {
    console.error('Failed to initialize application:', err);
    process.exit(1);
  }
})();
// Example email sending (for testing)
// const username = 'philemon ndayishimiye';
// const userEmail = 'philemonndayi@gmail.com';
// const verificationLink = `https://your-domain.com/verify?token=some-unique-token`;
// sendVerificationEmail(userEmail, username, verificationLink)
//   .then(taskId => console.log(`Email verification queued with ID: ${taskId}`))
//   .catch(err => console.error('Failed to queue verification email:', err));