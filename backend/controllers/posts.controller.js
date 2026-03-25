const User = require('../models/User')
const Post = require('../models/Post')
const { mapPost } = require('../utils/mappers/postMapper')
const createError = require('../utils/createError')
const sendResponse = require('../utils/sendResponse')
const asyncHandler = require('express-async-handler')

// @desc -> all posts
// @route GET /posts
const getAllPosts = asyncHandler(async (req, res) => {
    const { postCategory, user } = req.query

    const filter = {
        ...(postCategory ? { postCategory: { $regex: postCategory, $options: 'i' } } : {}),
        ...(user ? { user } : {}),
        published: true
    }

    const posts = await Post.find(filter).populate('user').lean()

    return sendResponse(res, {
        message: 'Posts fetched',
        data: posts.map(mapPost)
    })
})
// @desc -> all posts (admin)
// @route GET /admin/posts
const getAllPostsAdmin = asyncHandler(async (req, res) => {
    const { postCategory, user } = req.query

    const filter = {
        ...(postCategory ? { postCategory: { $regex: postCategory, $options: 'i' } } : {}),
        ...(user ? { user } : {})
    }

    const posts = await Post.find(filter).populate('user').lean()

    return sendResponse(res, {
        message: 'Posts fetched',
        data: posts.map(mapPost)
    })
})
// @desc -> single post
// @route GET /posts/:id 
const getSinglePost = asyncHandler(async (req, res) => {
    const { id } = req.validated.params
    const post = await Post.findById(id).populate('user').lean()

    if (!post) {
        throw createError('Post not found', 404)
    }
    return sendResponse(res, {
        message: 'Post fetched',
        data: mapPost(post)
    })

})
//	POST /posts -> create post
const createNewPost = asyncHandler(async (req, res) => {
    const { postType, postCategory, title, imgSrc, postContent, published } = req.validated.body
    if (!req.user?.id) throw createError('Unauthorized', 401)
    const dbUser = await User.findById(req.user.id)

    if (!dbUser) {
        throw createError('User not found', 404)
    }

    const post = await Post.create({
        user: req.user.id,
        postType,
        postCategory,
        title,
        imgSrc,
        postContent,
        published
    })

    const populatedPost = await post.populate('user')

    return sendResponse(res, {
        status: 201,
        message: `Post created`,
        data: mapPost(populatedPost)
    })
})
//	PUT /posts/:id -> update post
const updatePost = asyncHandler(async (req, res) => {
    const { id } = req.validated.params
    const { postType, postCategory, title, imgSrc, postContent, published } = req.validated.body

    const post = await Post.findById(id)
    if (!post) {
        throw createError(`Post with id ${id} not found`, 404)
    }

    post.postType = postType
    post.postCategory = postCategory
    post.title = title
    post.imgSrc = imgSrc
    post.postContent = postContent
    post.published = published

    const updatedPost = await post.save()

    await updatedPost.populate('user')

    return sendResponse(res, {
        message: 'Post updated',
        data: mapPost(updatedPost)
    })
})
//	PATCH /posts/:id -> update post partially
const updatePostPartial = asyncHandler(async (req, res) => {
    const { id } = req.validated.params
    const updates = req.validated.body

    const post = await Post.findById(id)
    if (!post) {
        throw createError(`Post with id ${id} not found`, 404)
    }

    const allowedFields = ['postType', 'postCategory', 'title', 'imgSrc', 'postContent', 'published']

    Object.keys(updates).forEach(key => {
        if (!allowedFields.includes(key)) {
            throw createError(`Invalid field: ${key}`, 400)
        }
        post[key] = updates[key]
    })

    const updatedPost = await post.save()

    await updatedPost.populate('user')

    return sendResponse(res, {
        message: 'Post updated',
        data: mapPost(updatedPost)
    })
})
//	DELETE /posts/:id -> delete post
const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.validated.params
    const post = await Post.findById(id)
    if (!post) {
        throw createError(`Post with id ${id} not found`, 404)
    }

    await post.deleteOne()

    return sendResponse(res, {
        message: 'Post deleted',
        data: null
    })
})

module.exports = {
    getAllPosts,
    getAllPostsAdmin,
    getSinglePost,
    createNewPost,
    updatePost,
    updatePostPartial,
    deletePost
}