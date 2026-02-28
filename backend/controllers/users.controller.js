const User = require('../models/User')
const Post = require('../models/Post')
const isValidObjectId = require('../utils/isValidObjectId')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')

// @desc -> all users
// @route GET /users 
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length) {
        res.status(400)
        throw new Error('No users found')
    }
    res.json(users)
})

// @desc -> single user
// @route GET /users/:id 
const getSingleUser = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!isValidObjectId(id)) {
        res.status(400)
        throw new Error('Invalid user ID')
    }
    const user = await User.findById(id).select('-password').lean()
    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }
    res.json(user)
})

// @desc -> create user
// @route POST /users 
const createNewUser = asyncHandler(async (req, res) => {
    const { username, name, email, password, roles } = req.body;

    const duplicate = await User.findOne({ $or: [{ username }, { email }] }).lean()
    if (duplicate) {
        res.status(409)
        throw new Error('Duplicate username or email not allowed')
    }
    const hashedPwd = await bcrypt.hash(password, 10)

    const user = await User.create({ username, name, email, "password": hashedPwd, roles })
    res.status(201).json({ message: `New user ${user.username} created` })
})

// @desc -> update user entirely
// @route PUT /users/:id 
const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!isValidObjectId(id)) {
        res.status(400)
        throw new Error('Invalid user ID')
    }
    const { username, name, email, password, roles } = req.body

    const user = await User.findById(id)
    if (!user) {
        res.status(400)
        throw new Error(`User with id ${id} not found`)
    }

    const duplicate = await User.findOne({ $or: [{ username }, { email }] }).lean()
    if (duplicate && duplicate?._id.toString() !== id) {
        res.status(409)
        throw new Error('Duplicate username or email')
    }

    user.username = username
    user.name = name
    user.email = email
    user.roles = roles
    if (password) user.password = await bcrypt.hash(password, 10)

    const updatedUser = await user.save()
    res.json({ message: `${updatedUser.username} updated` })
})

// @desc -> update user in part
// @route PATCH /users/:id 
const updateUserPartial = asyncHandler(async (req, res) => {

    const { id } = req.params

    if (!isValidObjectId(id)) {
        res.status(400)
        throw new Error('Invalid user ID')
    }

    const updates = req.body

    const user = await User.findById(id);
    if (!user) {
        res.status(404)
        throw new Error(`User with id ${id} not found`)
    }

    if (updates.username || updates.email) {
        const duplicate = await User.findOne({
            $or: [{ username: updates.username }, { email: updates.email }]
        }).lean();
        if (duplicate && duplicate._id.toString() !== id) {
            res.status(409)
            throw new Error('Duplicate username or email')
        }
    }

    if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10)
    }

    Object.keys(updates).forEach(key => {
        user[key] = updates[key]
    })

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated`, user: updatedUser })
})

// @desc -> delete user
// @route DELETE /users/:id 
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!isValidObjectId(id)) {
        res.status(400)
        throw new Error('Invalid user ID')
    }

    const post = await Post.findOne({ user: id }).lean()
    if (post) {
        res.status(400)
        throw new Error('User has posts that need to be deleted first')
    }

    const user = await User.findById(id)
    if (!user) {
        res.status(400)
        throw new Error(`User with id ${id} not found`)
    }

    const result = await user.deleteOne()

    res.json(`User deleted`)
})

module.exports = {
    getAllUsers,
    getSingleUser,
    createNewUser,
    updateUser,
    updateUserPartial,
    deleteUser
}