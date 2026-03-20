const User = require('../models/User')
const Post = require('../models/Post')
const createError = require('../utils/createError')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')

// @desc -> all users
// @route GET /users 
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    res.json(users ?? [])
})
// @desc -> all users (admin)
// @route GET admin/users 
const getAllUsersAdmin = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    res.json(users ?? [])
})

// @desc -> single user
// @route GET /users/:id 
const getSingleUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id).select('-password').lean()
    if (!user) {
        throw createError('User not found', 404)
    }
    res.json(user)
})

// @desc -> create user
// @route POST /users 
const createNewUser = asyncHandler(async (req, res) => {
    const { username, name, email, password, roles } = req.body;

    const duplicate = await User.findOne({ $or: [{ username }, { email }] }).lean()
    if (duplicate) {
        throw createError('Duplicate username or email not allowed', 409)
    }
    const hashedPwd = await bcrypt.hash(password, 10)

    const user = await User.create({ username, name, email, "password": hashedPwd, roles })
    res.status(201).json({ message: `New user ${user.username} created` })
})

// @desc -> update user entirely
// @route PUT /users/:id 
const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    const { username, name, email, password, roles } = req.body

    const user = await User.findById(id)
    if (!user) {
        throw createError(`User with id ${id} not found`, 404)
    }

    if (username || email) {
        const query = []
        if (username) query.push({ username })
        if (email) query.push({ email })

        const duplicate = await User.findOne({ $or: query }).lean()
        if (duplicate && duplicate._id.toString() !== id) {
            throw createError('Duplicate username or email', 409)
        }
    }

    if (roles !== undefined && !req.roles.includes('Admin')) {
        throw createError('Only admins can change roles', 403)
    }

    if (password) {
        user.password = await bcrypt.hash(password, 10)
    }

    const allowedUpdates = ['username', 'name', 'email']
    allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
            user[field] = req.body[field]
        }
    })

    if (roles !== undefined) {
        user.roles = roles
    }

    const updatedUser = await user.save()

    res.json({
        message: `${updatedUser.username} updated`,
        user: updatedUser
    })
})

// @desc -> update user in part
// @route PATCH /users/:id 
const updateUserPartial = asyncHandler(async (req, res) => {
    const { id } = req.params
    const updates = req.body

    const user = await User.findById(id);
    if (!user) {
        throw createError(`User with id ${id} not found`, 404)
    }

    if (updates.username || updates.email) {
        const query = []
        if (updates.username) query.push({ username: updates.username })
        if (updates.email) query.push({ email: updates.email })

        const duplicate = await User.findOne({ $or: query }).lean()
        if (duplicate && duplicate._id.toString() !== id) {
            throw createError('Duplicate username or email', 409)
        }
    }

    if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10)
    }

    const allowedUpdates = ['username', 'name', 'email', 'password']
    allowedUpdates.forEach(field => {
        if (updates[field] !== undefined) {
            user[field] = updates[field]
        }
    })

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated`, user: updatedUser })
})

// @desc -> delete user
// @route DELETE /users/:id 
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params

    const post = await Post.findOne({ user: id }).lean()
    if (post) {
        throw createError('User has posts that need to be deleted first', 409)
    }

    const user = await User.findById(id)
    if (!user) {
        throw createError(`User with id ${id} not found`, 404)
    }

    const result = await user.deleteOne()

    res.json({ message: 'User deleted' })
})

module.exports = {
    getAllUsers,
    getAllUsersAdmin,
    getSingleUser,
    createNewUser,
    updateUser,
    updateUserPartial,
    deleteUser
}