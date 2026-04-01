const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const optionalJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return next()

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = {
      id: decoded.id,
      username: decoded.username,
      roles: decoded.roles
    };
  } catch (err) {
    // invalid token = ignore, continue as guest
  }
  next()
})

module.exports = optionalJWT 