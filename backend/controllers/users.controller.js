const User = require('../models/User')
const Post = require('../models/Post')
const { mapUser } = require('../utils/mappers/userMapper')
const createError = require('../utils/createError')
const sendResponse = require('../utils/sendResponse')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')

// @desc -> all users
// @route GET /users 
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    return sendResponse(res, {
        message: 'Users fetched',
        data: users.map(mapUser)
    })
})
// @desc -> all users (admin)
// @route GET admin/users 
const getAllUsersAdmin = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()
    return sendResponse(res, {
        message: 'Users fetched',
        data: users.map(mapUser)
    })
})

// @desc -> single user
// @route GET /users/:id 
const getSingleUser = asyncHandler(async (req, res) => {
    const { id } = req.validated.params
    const user = await User.findById(id).select('-password').lean()
    if (!user) {
        throw createError('User not found', 404)
    }
    return sendResponse(res, {
        message: 'User fetched',
        data: mapUser(user)
    })
})

// @desc -> create user
// @route POST /users 
const createNewUser = asyncHandler(async (req, res) => {
    const { username, name, email, password } = req.validated.body

    const duplicate = await User.findOne({ $or: [{ username }, { email }] }).lean()
    if (duplicate) {
        throw createError('Duplicate username or email not allowed', 409)
    }
    const hashedPwd = await bcrypt.hash(password, 10)

    const user = await User.create({ username, name, email, "password": hashedPwd, roles: ['Contributor'] })
    return sendResponse(res, {
        status: 201,
        message: 'User created',
        data: mapUser(user)
    })
})

// @desc -> update user entirely
// @route PUT /users/:id 
const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.validated.params
    const { username, name, email, password } = req.validated.body

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

    if (password) {
        user.password = await bcrypt.hash(password, 10)
    }

    if (username !== undefined) user.username = username
    if (name !== undefined) user.name = name
    if (email !== undefined) user.email = email

    const updatedUser = await user.save()

    return sendResponse(res, {
        message: 'User updated',
        data: mapUser(updatedUser)
    })
})

// @desc -> update user in part
// @route PATCH /users/:id 
const updateUserPartial = asyncHandler(async (req, res) => {
    const { id } = req.validated.params
    const updates = req.validated.body

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

    return sendResponse(res, {
        message: 'User updated',
        data: mapUser(updatedUser)
    })
})


//@desc -> update user roles
//@route PATCH admin/users/:id/roles
const updateRoles = asyncHandler(async (req, res) => {
    const { id } = req.validated.params
    const { roles } = req.validated.body

    const user = await User.findById(id)
    if (!user) throw createError('User not found', 404)

    user.roles = roles
    await user.save()

    return sendResponse(res, {
        message: 'User roles updated',
        data: mapUser(user)
    })
})

// @desc -> delete user
// @route DELETE /users/:id 
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.validated.params
    const post = await Post.findOne({ user: id }).lean()
    if (post) {
        throw createError('User has posts that need to be deleted first', 409)
    }

    const user = await User.findById(id)
    if (!user) {
        throw createError(`User with id ${id} not found`, 404)
    }

    const result = await user.deleteOne()

    return sendResponse(res, {
        message: 'Post deleted',
        data: null
    })
})

module.exports = {
    getAllUsers,
    getAllUsersAdmin,
    getSingleUser,
    createNewUser,
    updateUser,
    updateUserPartial,
    updateRoles,
    deleteUser
}