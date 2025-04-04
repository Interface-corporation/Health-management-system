// config/sequelize.js

const  Sequelize  = require('sequelize');
const dbconfig = require('../config/config')

// Initialize Sequelize with the database configuration
const sequelize = new Sequelize(dbconfig);

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Export the Sequelize instance to be used in other files
module.exports = sequelize;
