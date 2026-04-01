const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const optionalJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization
  console.log('AUTH HEADER:', req.headers.authorization)
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
  console.log('JWT ERROR:', err.message)
}
  next()
})

module.exports = optionalJWT 