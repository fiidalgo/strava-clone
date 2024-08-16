// /backend/config/database.js
// Contains Sequelize initialization and connection setup to the PostgreSQL database

// Import Sequelize constructor from 'sequelize' package
const { Sequelize } = require('sequelize');

// Load env vars from .env file
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Create new Sequelize instance which sets up connection to database
// Params are database name, username, password, options
const sequelize = new Sequelize(
  process.env.DB_NAME,                            // Database name
  process.env.DB_USER,                            // Database username
  process.env.DB_PASSWORD,                        // Database password
  {
    host: process.env.DB_HOST,                    // Database host (default is localhost)
    dialect: process.env.DB_DIALECT,              // Database dialect (PostgreSQL)
    logging: false,                               // Disable logging (set to true to see SQL queries)
    pool: {                                       // Optional: Configure connection pooling
      max: 5,                                     // Max num of connections in pool
      min: 0,                                     // Min num of connections in pool
      acquire: 30000,                             // Max time (ms) to acquire connection before throwing an error
      idle: 10000                                 // Max time (ms) that a connection can be idle before being released
    }
  }
);

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Export Sequelize instance so it can be used in other parts of the app
module.exports = sequelize;