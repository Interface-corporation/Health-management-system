import express from 'express'
const app = express()
import middleware from './configuration/middleware.js';
import db from './setup/models/index.js';  // Import db instead of just sequelize
import authRoutes from './routes/authRoutes.js'
import { errorHandler } from './utils/errorHandler.js';
import bodyParser from 'body-parser';

// Get the sequelize instance from the db object
const { sequelize } = db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//  defining a route in Express
app.get('/', (req, res) => {
  res.json({
    message: "You are welcome to health Management System API"
  })
})

//apply middleware
middleware(app)

// Use routes
// app.use('/userRoutes', usersRoute)

// Use error-handling middleware
// app.use(notFoundHandler)
// app.use(globalErrorHandler)
app.use(errorHandler);

app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

//  specifying the port and starting the server
sequelize.sync()  // Now this will work because sequelize is the actual Sequelize instance
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