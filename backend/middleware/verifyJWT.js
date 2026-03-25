const jwt = require('jsonwebtoken');
const createError = require('../utils/createError');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        throw createError('Unauthorized', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = {
            id: decoded.id,
            username: decoded.username,
            roles: decoded.roles
        };

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw createError('Token expired', 403);
        }

        if (err.name === 'JsonWebTokenError') {
            throw createError('Invalid token', 403);
        }

        throw createError('Forbidden', 403);
    }
};

module.exports = verifyJWT;