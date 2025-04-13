import { Sequelize } from 'sequelize';
import dbconfig from '../config/config.js';

const sequelize = new Sequelize(dbconfig);

try {
  await sequelize.authenticate();
  console.log('Database connection has been established successfully.');
} catch (err) {
  console.error('Unable to connect to the database:', err);
}

export default sequelize;
