// /frontend/src/components/Login.js
// Provides the user interface and connects the inputs to the backend for the log in component

// Import libraries
import React, { useState } from 'react';
import axios from 'axios'; // For making HTTP requests to backend
import { useNavigate } from 'react-router-dom'; // useNavigate for redirecting users

function Login() {
  const [email, setEmail] = useState(''); // State variable for email
  const [password, setPassword] = useState(''); // State variable for password
  const [error, setError] = useState(''); // State variable for handling errors
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password }); // Send POST request to backend
      localStorage.setItem('token', res.data.token); // Store JWT token in localStorage
      navigate('/dashboard'); // Redirect user to the dashboard
    } catch (err) {
      setError('Invalid credentials. Please try again.'); // Set error message if login fails
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

// Export the Login component so it can be used in other parts of the app
export default Login;