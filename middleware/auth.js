const jwt = require('jsonwebtoken');

exports.isAuthenticated = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ error: 'Unauthorized.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token.' });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required.' });
    }
    next();
};

exports.isEditor = (req, res, next) => {
    if (req.user.role !== 'editor' && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Editor access required.' });
    }
    next();
};
