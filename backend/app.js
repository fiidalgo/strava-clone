// /backend/app.js
// Main server file that initializes Express, configures middleware, and defines API routes

// Import necessary modules
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/database');
const authRoutes = require('./routes/auth');
const runRoutes = require('./routes/runs');

// Load env vars from .env file
dotenv.config();

// Initialize Express app
const app = express();

app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// Test database connection and sync the models
db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Error: ' + err));

// Sync models with database
db.sync({ alter: true })
  .then(() => console.log('Database synced...'))
  .catch(err => console.error('Error syncing database: ' + err));

// Define routes
app.use('/api/auth', authRoutes); // Routes for user authentication (registration, login)
app.use('/api/runs', runRoutes); // Routes for logging, viewing, updating, deleting runs

// Define basic route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Running Tracker API');
});

// Define the port the server will listen on
const PORT = process.env.PORT;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Export the app for testing purposes
module.exports = app;