const { Sequelize } = require('sequelize');

// Initialize Sequelize with database connection details
const sequelize = new Sequelize('strava_clone', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false, // Set to true if you want to see the raw SQL queries
});

module.exports = sequelize;
