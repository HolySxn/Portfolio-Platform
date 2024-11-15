const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect middleware to verify authentication
exports.protect = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'User not found. Please log in again.' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ error: 'Invalid or expired token. Please log in again.' });
    }
};

// Authorization middleware to check user roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

// Global error handler middleware
exports.errorHandler = (err, req, res, next) => {
    console.error('Error:', err.stack);

    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: message
    });
};
