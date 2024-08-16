// /backend/models/index.js
// Centralizes model management making it easier to define and manage relationships between models

// Import the 'fs' (File System) and 'path' modules from Node.js
const fs = require('fs');
const path = require('path');

// Import the Sequelize instance configured in /backend/config/database.js
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

// Create empty object to hold all models
const db = {};

// Get the current file name so it can be excluded from model loading
const basename = path.basename(__filename);

// Check if the app is running in production or development mode
const env = process.env.NODE_ENV;

// Loop through all files in the current directory
fs.readdirSync(__dirname)
  .filter(file => {
    // Exclude the current file and any non-JavaScript files
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    // Import model and pass the Sequelize instance and DataTypes to it
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    // Add the model to the db object, using its name as the key
    db[model.name] = model;
  });

// If any models have associations (relationships), set them up here
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Add the Sequelize instance and the Sequelize class to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export the db object containing all models and the Sequelize instance
module.exports = db;