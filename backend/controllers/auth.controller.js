const User = require('../models/User')
const createError = require('../utils/createError')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

// @desc Register new user
// @route POST /auth/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, name, email, password } = req.body;

    const duplicate = await User.findOne({
        $or: [
            { username: { $regex: new RegExp(`^${username}$`, 'i') } },
            { email: { $regex: new RegExp(`^${email}$`, 'i') } }
        ]
    }).lean();

    if (duplicate) {
        throw createError('Username or email already exists', 409)
    }

    const hashedPwd = await bcrypt.hash(password, 10)

    const user = await User.create({ username, name, email, "password": hashedPwd, roles: ['Contributor'] })
    res.status(201).json({ message: `New user ${user.username} registered` })
})

// @desc Authenticate user and return JWT
// @route POST /auth/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const username = req.body.username.toLowerCase().trim()
    const password = req.body.password

    const user = await User.findOne({ username }).select('+refreshToken')
    if (!user) {
        throw createError(`Invalid username or password`, 401)
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw createError('Invalid username or password', 401)
    }

    const payload = {
        id: user._id,
        username: user.username,
        name: user.name, 
        roles: user.roles
    }

    const token = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
    )

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    )

    const hashedToken = await bcrypt.hash(refreshToken, 10)

    user.refreshToken = hashedToken;
    await user.save();

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000
    })

    return res.json({
        token,
        user: {
            id: user._id,
            username: user.username,
            name: user.name, 
            roles: user.roles
        }
    })
})

// @desc Refresh token
// @route GET /auth/refresh
// @access Public
const refreshUser = asyncHandler(async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) {
        throw createError('Unauthorized: No cookie found', 401)
    }

    const refreshToken = cookies.jwt

    let decoded
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch {
        throw createError('Forbidden: Invalid token', 403)
    }

    const user = await User.findById(decoded.id).select('+refreshToken')

    if (!user || !user.refreshToken) {
        throw createError('Unauthorized', 401)
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken)

    if (!isMatch) {
        throw createError('Forbidden: Token mismatch', 403)
    }

    const accessToken = jwt.sign(
        {
            id: user._id,
            username: user.username,
            roles: user.roles
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
    )

    return res.json({ token: accessToken })
})

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logoutUser = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(204); 
    }

    const refreshToken = cookies.jwt;
    let decoded
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (err) {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
        })
        return res.sendStatus(204)
    }

    const user = await User.findById(decoded.id).select('+refreshToken')

    if (user) {
        const isMatch = await bcrypt.compare(refreshToken, user.refreshToken || '')
        if (isMatch) {
            user.refreshToken = null;
            await user.save();
        }
    }

    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
    })

    res.sendStatus(204)
})


// @desc Get current logged-in user
// @route GET /auth/me
// @access Protected via cookie (httpOnly JWT)
const getCurrentUser = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw createError('Unauthorized', 401)
    }

    const user = await User.findById(req.user.id).lean()

    if (!user) {
        throw createError('User not found', 404)
    }

    res.json({
        user: {
            id: user._id,
            username: user.username,
            roles: user.roles,
            name: user.name,
            email: user.email
        }
    })
})


module.exports = {
    registerUser,
    loginUser,
    refreshUser,
    logoutUser,
    getCurrentUser
}