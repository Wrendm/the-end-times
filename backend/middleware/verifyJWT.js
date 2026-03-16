const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const verifyJWT = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer')) {
        res.status(401)
        throw new Error('Unauthorized')
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                res.status(403)
                throw new Error('Forbidden')
            }
            req.user = decoded.username
            req.roles = decoded.roles
            next()
        }
    )
})

module.exports = verifyJWT