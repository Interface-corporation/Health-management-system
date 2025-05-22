import { Sequelize } from 'sequelize';
import dbconfig from '../../config/config.js';
import userModel from './user.js';
// Import other models as needed

// Create Sequelize instance
const sequelize = new Sequelize(dbconfig);

// Initialize models
const User = userModel(sequelize);
// Initialize other models similarly

// Create db object with all models and Sequelize instance
const db = {
  sequelize,    // <-- This is the actual Sequelize instance
  Sequelize,    // <-- This is the Sequelize class
  User,         // <-- This is the User model
  // Add other models
};

// Set up associations if needed
// For example: User.hasMany(db.SomeOtherModel)

try {
  await sequelize.authenticate();
  console.log('Database connection has been established successfully.');
} catch (err) {
  console.error('Unable to connect to the database:', err);
}

export default db;  // Export the entire db object, not just sequelize