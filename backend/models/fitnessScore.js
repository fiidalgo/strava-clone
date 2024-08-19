// /backend/models/fitnessScore.js
// Defines structure of the FitnessScores table using Sequelize ORM

module.exports = (sequelize, DataTypes) => {
    // Define FitnessScore model
    const FitnessScore = sequelize.define('FitnessScore', {
        // Primary key
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        // Foreign key referencing Users table
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // References Users table
                key: 'id' // References ID column in Users table
            }
        },
        // Date of fitness score record
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        // Fitness score for the specific date
        score: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0 // Default value of 0 for the fitness score
        }
    });

    // Return the defined model so it can be used in other parts of the app
    return FitnessScore;
};