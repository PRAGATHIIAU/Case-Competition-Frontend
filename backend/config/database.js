/**
 * Sequelize Database Configuration
 * Connects to PostgreSQL database
 */
require('dotenv').config();
const { Sequelize } = require('sequelize');
const pool = require('./db'); // Import pool for query function

const sequelize = new Sequelize(
  process.env.DB_NAME || 'alumni_portal',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Sequelize: Database connection established successfully.');
  })
  .catch(err => {
    console.error('❌ Sequelize: Unable to connect to the database:', err);
  });

// Export query function for CommonJS modules
const query = async (text, params) => {
  const result = await pool.query(text, params);
  return result;
};

// For CommonJS modules - export both sequelize and query
module.exports = sequelize;
module.exports.query = query;
