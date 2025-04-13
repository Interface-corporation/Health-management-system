 import express from 'express'
const app = express()
import middleware from './configuration/middleware.js';
import { notFoundHandler, globalErrorHandler } from './utils/errorHandler.js';
import usersRoute from './routes/userRoutes.js';
import sequelize  from'./models/index.js';

// Initialize Sequelize with the database configuration



//  defining a route in Express
app.get('/', (req, res) => {
    res.send('<h1>Hello server!</h1>')
  })



//apply middleware

middleware(app)

// Use routes
app.use('/userRoutes', usersRoute)

// Use error-handling middleware
app.use(notFoundHandler)
app.use(globalErrorHandler)



//  specifying the port and starting the server
sequelize.sync()
  .then(() => {
    console.log('Database models synchronized successfully.');

    // Start the server only after the database sync is successful
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    
  })
  .catch(err => {
    console.error('Error syncing database models:', err);
  });
