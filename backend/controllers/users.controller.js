const User = require('../models/User')
const Post = require('../models/Post')
const bcrypt = require('bcrypt')

// @desc -> all users
// @route GET /users 
const getAllUsers = async (req, res) => {
    const users = await User.find().select('-password').lean()
    if (!users?.length){
        return res.status(400).json({message: 'No users found'})
    }
    res.json(users)
}

// @desc -> single user
// @route GET /users/:id 
const getSingleUser = async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id).select('-password').lean()
    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
}

// @desc -> create user
// @route POST /users 
const createNewUser = async (req, res) => {
    const {username, name, email, password, roles} = req.body;
    //confirm data, this will be moved to the other file at the end
    //TODO add email validation in that other file
    if(!username || !name || !email || !password || !Array.isArray(roles) || !roles.length){
        return res.status(400).json({message: 'All fields are required'})
    }

    const duplicate = await User.findOne({username}).lean()
    if(duplicate){
        return res.status(409).json({message: 'Duplicate username'})
    }

    const hashedPwd = await bcrypt.hash(password, 10)
    const userObject = {username, name, email, "password": hashedPwd, roles}

    const user = await User.create(userObject)
    if(user){
        res.status(201).json({message: `New user ${username} created`})
    }else{
        res.status(400).json({message: `User could not be created`})
    }
}

//TODO: seperate method for PUT and PATCH
// @desc -> update user
// @route PUT /users/:id 
const updateUser = async (req, res) => {
    const { id } = req.params
    const {username, name, email, password, roles} = req.body;

    if(!username || !name || !email || !Array.isArray(roles) || !roles.length){
        return res.status(400).json({message: 'All fields are required'})
    }

    const user = await User.findById(id)
    if(!user){
        return res.status(400).json({message: 'User not found'})
    }
    const duplicate = await User.findOne({username}).lean()
    if(duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({message:'Duplicate username'})
    }

    user.username = username
    user.name = name
    user.email = email
    user.roles = roles
    if(password){
        user.password = await bcrypt.hash(password, 10)
    }
    const updatedUser = await user.save()
    res.json({message: `${updatedUser.username}`})
}

// @desc -> delete user
// @route DELETE /users/:id 
const deleteUser = async (req, res) => {
    const {id} = req.body;
    if(!id){
        return res.status(400).json({message:'User ID Required'})
    }

    const post = await Post.findOne({user:id}).lean()
    if(post){
        return res.status(400).json({message: 'User has posts that need to be deleted first'})
    }
    const user = await User.findById(id)

    if(!user){
        return res.status(400).json({message: 'User not found'})
    }
    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
}

//TODO: move actual search (business logic) into validator file, in this file only determine whether that function returned then set status to 200 or 404 based on that

module.exports = {
    getAllUsers,
    getSingleUser,
    createNewUser,
    updateUser,
    deleteUser
}