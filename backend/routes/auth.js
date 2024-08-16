// /backend/routes/auth.js
// Contains the routes for user authentication (login, register). Handles backend logic for these operations

const express = require('express'); // Import Express to create the router
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords securely
const jwt = require('jsonwebtoken'); // Import JWT for creating and verifying tokens
const { body, validationResult } = require('express-validator'); // Import express-validator for input validation
const db = require('../models'); // Import the db object which includes all models

// Create new router object to handle routes
const router = express.Router();

// Register Route
router.post('/register', [
  // Validate and sanitize input fields
  body('email').isEmail().withMessage('Enter a valid email'), // Check if email is valid
  body('password').exists().withMessage('Password is required') // Check if password is at least 6 characters long
], async (req, res) => {
  const errors = validationResult(req); // Gather any validation errors from the request
  if (!errors.isEmpty()) { // If there are validation errors, return them to the client 
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body; // Extract email and password from request body

  try {
    // Check if user with provided email already exists in database
    let user = await db.User.findOne({ where: { email } });
    if (user) {
      // If a user with that email already exists, return an error
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10); // Generate salt for hashing
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password using salt

    // Create new user record in database with hashed password
    user = await db.User.create({
      email,
      password: hashedPassword
    });

    // Create a JWT payload contianing user's id
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign the token and send it to the client with a 1-hour expiration time
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err; // If there is an error signing the token, throw it
      res.json({ token }); // Send the token back to the client as a JSON response
    });
  } catch (err) {
    console.error(err.message); // Log any server errors
    res.status(500).send('Server error'); // Return a 500 status is a server error occurs
  }
});

// Login Route
router.post('/login', [
  // Validate and sanitize input fields
  body('email').isEmail().withMessage('Enter a valid email'), // Check if email is valid
  body('password').exists().withMessage('Password is required') // Check that a password was provided
], async (req, res) => {
  const errors = validationResult(req); // Gather any validation errors from the request
  if (!errors.isEmpty()) { // If there are validation errors, return them to the client 
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body; // Extract the email and password from the request body

  try {
    // Check if a user with the provided email exists in the database
    let user = await db.User.findOne({ where: { email } });
    if (!user) {
      // If no user with that email exists, return an error
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
    }

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If the passwords don't match, return an error
      return res.status(400).json({ errors: [{ msg: 'Invalid credentials'}] });
    }

    // Create a JWT payload contianing the user's id
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign the token and send it to the client with a 1-hour expiration time
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err; // If there is an error signing the token throw it
      res.json({ token }); // Send the token back to the client as a JSON response
    });
  } catch (err) {
    console.error(err.message); // Log any server errors
    res.status(500).send('Server error'); // Return a 500 status if a server error occurs
  }
});

// Export the router so it can be used in other parts of the app
module.exports = router;