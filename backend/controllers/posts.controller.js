const User = require('../models/User')
const Post = require('../models/Post')
const bcrypt = require('bcrypt')

// @desc -> all posts
// @route GET /posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().lean()
        if (!posts?.length) return res.status(400).json({ message: 'No posts found' })
        res.json(posts)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}
// @desc -> single post
// @route GET /posts/:id 
const getSinglePost = async (req, res) => {
    try {
        const { id } = req.params
        const post = await User.findById(id).lean()
        if (!post) return res.status(404).json({ message: 'Post not found' })
        res.json(post)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}
//	POST /posts -> create post
const createNewPost = async (req, res) => {
    try {
        const { userId, username, postType, postCategory, title, imgSrc, postContent, published } = req.body
        const post = await Post.create({ userId, username, postType, postCategory, title, imgSrc, postContent, published })
        res.status(201).json({ message: `New post ${post.title} created` })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}
//	PUT /posts/:id -> update post
const updatePost = async (req, res) => {
    try {
        const { id } = req.params
        const { username, postType, postCategory, title, imgSrc, postContent, published } = req.body

        const post = await Post.findById(id)
        if (!post) return res.status(400).json({ message: `Post with id ${id} not found` })

        post.username = username
        post.postType = postType
        post.postCategory = postCategory
        post.title = title
        post.imgSrc = imgSrc
        post.postContent = postContent
        post.published = published

        const updatedPost = await post.save()
        res.json({ message: `${updatedPost.title} updated` })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}
//	PATCH /posts/:id -> update post partially
const updatePostPartial = async (req, res) => {
    try {
        const { id } = req.params
        const updates = req.body

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: `Post with id ${id} not found` })

        Object.keys(updates).forEach(key => {
            post[key] = updates[key]
        });

        const updatedPost = await post.save()

        res.json({ message: `${updatedPost.title} updated`, post: updatedPost })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}
//	DELETE /posts/:id -> delete post
const deletePost = async (req, res) => {
    try {
        const { id } = req.params

        const post = await Post.findById(id)
        if (!post) return res.status(400).json({ message: `Post with id ${id} not found` })

        const result = await post.deleteOne()

        res.json(`Post deleted`)
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}

module.exports = {
    getAllPosts,
    getSinglePost,
    createNewPost,
    updatePost,
    updatePostPartial,
    deletePost
}