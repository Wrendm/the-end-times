const User = require('../models/User')
const Post = require('../models/Post')
const Category = require('../models/Category')
const { mapPost } = require('../utils/mappers/postMapper')
const createError = require('../utils/createError')
const sendResponse = require('../utils/sendResponse')
const validatePostByCategory = require('../utils/validatePostByCategory')
const asyncHandler = require('express-async-handler')

// @desc -> all posts
// @route GET /posts
// posts.controller.js
const getAllPosts = asyncHandler(async (req, res) => {
  const { postCategory, user } = req.validated.query 

  const filter = { published: true } 


  if (postCategory) {
    const category = await Category.findOne({ name: postCategory }).lean() 
    if (!category) {
      throw createError(`Category "${postCategory}" not found`, 404) 
    }
    filter.postCategory = category._id  
  }
  if (user) {
    filter.user = user 
  }

  const posts = await Post.find(filter)
    .populate('user', 'username name roles')
    .populate('postCategory', 'name type')
    .lean() 

  return sendResponse(res, {
    message: 'Posts fetched',
    data: posts.map(mapPost),
  }) 
}) 
// @desc -> all posts (admin)
// @route GET /admin/posts
const getAllPostsAdmin = asyncHandler(async (req, res) => {
    const { postCategory, user } = req.query

    let filter = {}

    if (postCategory) {
        const category = await Category.findOne({ name: postCategory }).lean()
        if (!category) {
            throw createError(`Category "${postCategory}" not found`, 404)
        }
        filter.postCategory = category._id
    }

    if (user) {
        const mongoose = require('mongoose')
        if (!mongoose.isValidObjectId(user)) {
            throw createError('Invalid user ID', 400)
        }
        filter.user = user
    }

    const posts = await Post.find(filter)
        .populate('user', 'username name roles')
        .populate('postCategory', 'name type')
        .lean()

    return sendResponse(res, {
        message: 'Posts fetched',
        data: posts.map(mapPost)
    })
})
// @desc -> single post
// @route GET /posts/:id 
const getSinglePost = asyncHandler(async (req, res) => {
    const { id } = req.validated.params
    const post = await Post.findById(id).populate('user').populate('postCategory').lean()

    if (!post || (!req.user.roles.includes('Admin') && !post.published)) {
        throw createError('Post not found', 404)
    }

    return sendResponse(res, {
        message: 'Post fetched',
        data: mapPost(post)
    })

})
//	POST /posts -> create post
const createNewPost = asyncHandler(async (req, res) => {
    const { postCategory, title, imgSrc, postContent, published } = req.validated.body

    const dbUser = await User.findById(req.user.id)
    if (!dbUser) {
        throw createError('User not found', 404)
    }

    const category = await Category.findById(postCategory)
    if (!category || !category.published) {
        throw createError('Invalid category', 400)
    }
    validatePostByCategory(category, req.validated.body)

    const post = await Post.create({
        user: req.user.id,
        postCategory,
        title,
        imgSrc,
        postContent,
        published
    })

    const populatedPost = await post.populate(['user', 'postCategory'])

    return sendResponse(res, {
        status: 201,
        message: `Post created`,
        data: mapPost(populatedPost)
    })
})
//	PUT /posts/:id -> update post
const updatePost = asyncHandler(async (req, res) => {
    const { id } = req.validated.params
    const { postCategory, title, imgSrc, postContent, published } = req.validated.body

    const post = await Post.findById(id)
    if (!post) {
        throw createError(`Post not found`, 404)
    }

    const category = await Category.findById(postCategory)
    if (!category || !category.published) {
        throw createError('Invalid category', 400)
    }
    validatePostByCategory(category, req.validated.body)

    post.postCategory = postCategory
    post.title = title
    post.imgSrc = imgSrc
    post.postContent = postContent
    post.published = published

    const updatedPost = await post.save()

    await updatedPost.populate(['user', 'postCategory'])

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
        throw createError(`Post not found`, 404)
    }

    const allowedFields = ['postCategory', 'title', 'imgSrc', 'postContent', 'published']

    let category = null

    if (updates.postCategory) {
        category = await Category.findById(updates.postCategory)
        if (!category || !category.published) {
            throw createError('Invalid category', 400)
        }
    } else {
        category = await Category.findById(post.postCategory)
    }

    const mergedData = {
        ...post.toObject(),
        ...updates
    }
    validatePostByCategory(category, mergedData)

    Object.keys(updates).forEach(key => {
        if (!allowedFields.includes(key)) {
            throw createError(`Invalid field: ${key}`, 400)
        }
        post[key] = updates[key]
    })

    const updatedPost = await post.save()
    await updatedPost.populate(['user', 'postCategory'])

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
        throw createError(`Post not found`, 404)
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