const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const createError = require('../utils/createError')

const optionalJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // no token → explicitly unauthenticated, continue
  if (!authHeader?.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = {
      id: decoded.id,
      username: decoded.username,
      roles: decoded.roles
    };
  } catch (err) {
    // optional auth should NOT throw
    req.user = null;
  }
  next();
});

module.exports = optionalJWT 