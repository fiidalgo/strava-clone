// /backend/models/user.js
// Specifies what columns exist in the users table, their data types, and any constraints. Maps JavaScript to database table users using Sequelize.
// Sets up CRUD operations on the users table using User.create(), User.findAll(), User.update(), User.destroy()

// Export a function that defines the User model
// This function receives the Sequelize instance and DataTypes as arguments
module.exports = (sequelize, DataTypes) => {
  // Define User model using sequelize.define
  // Args are model name and object defining the model's attributes (cols)
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Col must have unique values
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    currentFitnessScore: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    }
  });

  // Define associations (relationships) for the User model
  User.associate = models => {
    // This sets up one-to-many relationship between User and Run
    User.hasMany(models.Run, {
      foreignKey: 'userId', // Foreign key in the Post table referencing the User
      as: 'runs' // Alias for accessing user's runs
    });
    // One-to-many relationship: User has many FitnessScores
    User.hasMany(models.FitnessScore, {
      foreignKey: 'userId', // Foreign key in FitnessScore table that references the User
      as: 'fitnessScores' // Alias for accessing a user's fitness scores
    })
  };

  // Return User model so it can be used in other parts of app
  return User;
};