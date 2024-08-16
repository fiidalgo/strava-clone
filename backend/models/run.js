// /backend/model/run.js
// Specifies what columns exist in the runs table, their data types, and any constraints. Maps JavaScript to database table runs using Sequelize.

// Export function that defines Run model
// This function receives Sequelize instance and DataTypes as arguments
module.exports = (sequelize, DataTypes) => {
    // Define Run model using sequelize.define
    // Args are model name and an object defining the model's attributes (cols)
    const Run = sequelize.define('Run', {
        date: {
            type: DataTypes.DATEONLY, // DATEONLY (stores only the date)
            allowNull: false // Col cannot be null
        },
        distance: {
            type: DataTypes.FLOAT, // FLOAT (for decimal values)
            allowNull: false
        },
        time: {
            type: DataTypes.STRING, // Store time as a string
            allowNull: false
        },
        pace: {
            type: DataTypes.STRING, // Store pace as a string in mm:ss format
            allowNull: false,
            defaultValue: '00:00'
        },
        userId: {
            type: DataTypes.INTEGER, // INTEGER (foreign key to the User model)
            allowNull: false,
            references: {
                model: 'Users', // References the Users table
                key: 'id' // Primary key in the Users table
            }
        }
    });

    // Define associations for Run model
    Run.associate = models => {
        // Sets up many-to-one relationship between Run and User
        Run.belongsTo(models.User, {
            foreignKey: 'userId', // Foreign key in the Run table referencing the User
            as: 'user' // Alias for accessing the user who logged the run
        });
    };

    // Return Run model so it can be used in other parts of app
    return Run;
};