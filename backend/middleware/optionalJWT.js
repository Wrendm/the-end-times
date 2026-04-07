const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const createError = require('../utils/createError')

const optionalJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return next()

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = {
      id: decoded.id,
      username: decoded.username,
      roles: decoded.roles
    };
  } catch (err) {

    if (err.name === 'TokenExpiredError') {
      throw createError('Token expired', 403);
    }

    if (err.name === 'JsonWebTokenError') {
      throw createError('Invalid token', 403);
    }

    throw createError('Forbidden', 403);
  }
  next()
})

module.exports = optionalJWT 