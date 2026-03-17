const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer')) {
        res.status(401)
        throw new Error('Unauthorized: Auth header does not start with bearer')
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = { id: decoded.id, username: decoded.username }
        req.roles = decoded.roles
        next()
    } catch (err) {
        return res.sendStatus(403)
    }
}

module.exports = verifyJWT