const express = require('express');
const sequelize = require('./config/database');  // Import the Sequelize instance

const app = express();

// Middleware and routes setup...

// Sync models with the database
sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
