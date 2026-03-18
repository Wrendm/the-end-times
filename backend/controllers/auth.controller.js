const User = require('../models/User')
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
    
    const hashedPwd = await bcrypt.hash(password, 10)

    const user = await User.create({ username, name, email, "password": hashedPwd, roles: ['Contributor'] })
    res.status(201).json({ message: `New user ${user.username} registered` })
})

// @desc Authenticate user and return JWT
// @route POST /auth/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: { $regex: `^${username}$`, $options: 'i' } })
    if (!user) {
        res.status(401)
        throw new Error(`Invalid username or password`)
    }
    const match = await bcrypt.compare(password, user.password)
    if (!user || !match) {
        res.status(401)
        throw new Error('Invalid username or password')
    }

    const payload = {
        id: user._id,
        username: user.username,
        roles: user.roles
    }

    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })

    const refreshToken = jwt.sign(
        { "username": user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    )

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 24 * 60 * 60 * 1000
    })

    return res.json({
        token,
        user: {
            id: user._id,
            username: user.username,
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
        res.status(401)
        throw new Error('Unauthorized')
    }

    const refreshToken = cookies.jwt

    let decoded

    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    } catch (err) {
        res.status(403)
        throw new Error('Forbidden')
    }

    const user = await User.findOne({ username: decoded.username }).lean()

    if (!user) {
        res.status(401)
        throw new Error('Unauthorized')
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
const logoutUser = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.sendStatus(204)

    res.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax"
    });

    return res.json({ message: 'Cookie cleared' })
}

// @desc Get current logged-in user
// @route GET /auth/me
// @access Protected via cookie (httpOnly JWT)
const getCurrentUser = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        res.status(401);
        throw new Error("Unauthorized: No cookie found");
    }

    let decoded;
    try {
        decoded = jwt.verify(cookies.jwt, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        res.status(403);
        throw new Error("Forbidden: Invalid token");
    }

    const user = await User.findOne({ username: decoded.username }).lean();

    if (!user) {
        res.status(401);
        throw new Error("Unauthorized: User not found");
    }

    res.json({
        user: {
            id: user._id,
            username: user.username,
            roles: user.roles,
            name: user.name,
            email: user.email,
        },
    });
});


module.exports = {
    registerUser,
    loginUser,
    refreshUser,
    logoutUser,
    getCurrentUser
}