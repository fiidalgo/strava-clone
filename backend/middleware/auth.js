// /backend/middleware/auth.js
// JWT authentication middleware that checks the JWT token sent by client to ensure validity before allowing access to protected routes

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token validation error:', err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};