const jwt = require('jsonwebtoken')
const createError = require('../utils/createError')

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        throw createError('Unauthorized', 401)
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        req.user = {
            id: decoded.id,
            username: decoded.username
        }

        req.roles = decoded.roles || []

        next()
    } catch (err) {
        throw createError('Forbidden', 403)
    }
}

module.exports = verifyJWT