const express = require('express')
const app = express()
const middleware = require('./configuration/middleware');
const { notFoundHandler, globalErrorHandler } = require('./utils/errorHandler');
const sequelize = require('./models/index');

// Initialize Sequelize with the database configuration



//  defining a route in Express
app.get('/', (req, res) => {
    res.send('<h1>Sequelize Connected!</h1>')
  })

// Include route files
const usersRoute = require('./routes/userRoutes')

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
