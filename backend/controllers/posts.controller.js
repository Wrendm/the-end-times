const User = require('../models/User')
const Post = require('../models/Post')
const isValidObjectId = require('../utils/isValidObjectId')
const asyncHandler = require('express-async-handler')

// @desc -> all posts
// @route GET /posts
const getAllPosts = asyncHandler(async (req, res) => {
    const posts = await Post.find().lean()
    if (!posts?.length) {
        res.status(400)
        throw new Error('No posts found')
    }
    res.json(posts)
})
// @desc -> single post
// @route GET /posts/:id 
const getSinglePost = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!isValidObjectId(id)) {
        res.status(400)
        throw new Error('Invalid user ID')
    }
    const post = await User.findById(id).lean()
    if (!post) {
        res.status(404)
        throw new Error('Post not found')
    }
    res.json(post)
})
//	POST /posts -> create post
const createNewPost = asyncHandler(async (req, res) => {
    const { userId, username, postType, postCategory, title, imgSrc, postContent, published } = req.body
    const post = await Post.create({ userId, username, postType, postCategory, title, imgSrc, postContent, published })
    res.status(201).json({ message: `New post ${post.title} created` })
})
//	PUT /posts/:id -> update post
const updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!isValidObjectId(id)) {
        res.status(400)
        throw new Error('Invalid user ID')
    }
    const { username, postType, postCategory, title, imgSrc, postContent, published } = req.body

    const post = await Post.findById(id)
    if (!post) {
        res.status(400)
        throw new Error(`Post with id ${id} not found`)
    }

    post.username = username
    post.postType = postType
    post.postCategory = postCategory
    post.title = title
    post.imgSrc = imgSrc
    post.postContent = postContent
    post.published = published

    const updatedPost = await post.save()
    res.json({ message: `${updatedPost.title} updated` })
})
//	PATCH /posts/:id -> update post partially
const updatePostPartial = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!isValidObjectId(id)) {
        res.status(400)
        throw new Error('Invalid user ID')
    }
    const updates = req.body

    const post = await Post.findById(id);
    if (!post) {
        res.status(404)
        throw new Error(`Post with id ${id} not found`)
    }

    Object.keys(updates).forEach(key => {
        post[key] = updates[key]
    });

    const updatedPost = await post.save()

    res.json({ message: `${updatedPost.title} updated`, post: updatedPost })
})
//	DELETE /posts/:id -> delete post
const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!isValidObjectId(id)) {
        res.status(400)
        throw new Error('Invalid user ID')
    }

    const post = await Post.findById(id)
    if (!post) {
        res.status(400)
        throw new Error(`Post with id ${id} not found`)
    }

    const result = await post.deleteOne()

    res.json(`Post deleted`)
})

module.exports = {
    getAllPosts,
    getSinglePost,
    createNewPost,
    updatePost,
    updatePostPartial,
    deletePost
}