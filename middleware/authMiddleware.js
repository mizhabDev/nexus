const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        
        if (token) {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decodedToken.id);
            req.user = user;
            res.locals.user = user;
        } else {
            res.locals.user = null;
        }
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.locals.user = null;
        next();
    }
};

const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    next();
};

module.exports = { authenticateToken, requireAuth };