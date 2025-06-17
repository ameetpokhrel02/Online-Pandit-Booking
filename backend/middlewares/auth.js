// backend/middlewares/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Access denied.');

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid token.');
        req.user = user;
        next();
    });
};

const admin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).send('Access denied.');
    next();
};

module.exports = { auth, admin };