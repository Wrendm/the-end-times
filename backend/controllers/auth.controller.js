const User = require('../models/User')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

// @desc -> register new user
// @route POST /auth/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, name, email, password} = req.body;

    const duplicate = await User.findOne({ $or: [{ username }, { email }] }).lean()
    if (duplicate) {
        throw new Error('Duplicate username or email not allowed')
    }
    const hashedPwd = await bcrypt.hash(password, 10)

    const user = await User.create({ username, name, email, "password": hashedPwd, roles: ['Contributor'] })
    res.status(201).json({ message: `New user ${user.username} registered` })
})

// @desc -> authenticate user and return JWT
// @route POST /auth/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { username, password} = req.body;

    const user = await User.findOne({ username })
    if (!user) {
        res.status(400)
        throw new Error(`User with username ${username} not found`)
    }const match = await bcrypt.compare(password, user.password)
    if (!match) {
        res.status(401)
        throw new Error('Invalid username or password')
    }

    const payload = {
        id: user._id,
        username: user.username,
        roles: user.roles
    }

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })

    res.json({
        token,
        user: {
            id: user._id,
            username: user.username,
            roles: user.roles
        }
    })
})

module.exports = {
    registerUser,
    loginUser
}