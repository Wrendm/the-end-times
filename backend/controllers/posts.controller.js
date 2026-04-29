const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Post = require('../models/Post')
const Category = require('../models/Category')
const { mapPost } = require('../utils/mappers/postMapper')
const createError = require('../utils/createError')
const sendResponse = require('../utils/sendResponse')
const getYouTubeEmbedUrl = require('../utils/getYouTubeEmbedLink')
const validatePostByCategory = require('../utils/validatePostByCategory')
const { uploadToCloudinary } = require('../utils/cloudinaryUpload')
const { deleteFromCloudinary } = require('../utils/cloudinaryDelete')


// @desc -> all posts
// @route GET /posts
// posts.controller.js
const getAllPosts = asyncHandler(async (req, res) => {
    const { postCategory, user } = req.validated.query

    let filter = {}

    if (postCategory) {
        const category = await Category.findOne({ name: postCategory }).lean()
        if (!category) {
            throw createError(`Category "${postCategory}" not found`, 404)
        }
        filter.postCategory = category._id
    }

    if (user) {
        filter.user = user

        if (!req.user || req.user.id !== user) {
            filter.published = true
        }
    } else {
        filter.published = true
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
    const { postCategory, user } = req.validated.query

    let filter = {}

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
// @desc -> single post
// @route GET /posts/:id 
const getSinglePost = asyncHandler(async (req, res) => {
    const { id } = req.validated.params

    const post = await Post.findById(id)
        .populate('user', 'username roles')
        .populate('postCategory', 'name')

    // If post doesn't exist, or not published and user isn't admin
    if (!post || (!((req.user?.roles?.includes('Admin')) || req.user?.id === post.user.id) && !post.published)) {
        throw createError('Post not found', 404)
    }

    return sendResponse(res, {
        message: 'Post fetched',
        data: mapPost(post)
    })
})
//	POST /posts -> create post
const createNewPost = asyncHandler(async (req, res) => {
    const { postCategory, title, postContent, published } = req.validated.body
    let { videoSrc } = req.validated.body

    const dbUser = await User.findById(req.user.id)
    if (!dbUser) {
        throw createError('User not found', 404)
    }

    const category = await Category.findById(postCategory)
    if (!category || !category.published) {
        throw createError('Invalid category', 400)
    }
    validatePostByCategory(category, req.validated.body, req.file)

    let imgSrc = null
    if (req.file) {
        imgSrc = await uploadToCloudinary(req.file, 'posts')
    }

    if (videoSrc) {
        videoSrc = getYouTubeEmbedUrl(videoSrc)
        if (!videoSrc) throw createError('Invalid YouTube URL', 400)
    }

    const post = await Post.create({
        user: req.user.id,
        postCategory,
        title,
        imgSrc,
        postContent,
        videoSrc,
        published
    })

    const populatedPost = await post.populate([
        { path: 'user', select: 'username roles' },
        { path: 'postCategory', select: 'name' }
    ])

    return sendResponse(res, {
        status: 201,
        message: `Post created`,
        data: mapPost(populatedPost)
    })
})
//	PUT /posts/:id -> update post
const updatePost = asyncHandler(async (req, res) => {
    const { id } = req.validated.params
    const { postCategory, title, postContent, published } = req.validated.body
    let { videoSrc } = req.validated.body

    const post = await Post.findById(id)
    if (!post) {
        throw createError(`Post not found`, 404)
    }

    const category = await Category.findById(postCategory)
    if (!category || !category.published) {
        throw createError('Invalid category', 400)
    }
    validatePostByCategory(category, req.validated.body, req.file)

    if (req.file) {
        if (post.imgSrc) await deleteFromCloudinary(post.imgSrc)
        post.imgSrc = await uploadToCloudinary(req.file, 'posts')
    }

    if (videoSrc) {
        videoSrc = getYouTubeEmbedUrl(videoSrc)
        if (!videoSrc) {
            throw createError('Invalid YouTube URL', 400)
        }
    }

    post.postCategory = postCategory
    post.title = title
    post.postContent = postContent
    post.videoSrc = videoSrc
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

    const allowedFields = ['postCategory', 'title', 'postContent', 'videoSrc', 'published']

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
    validatePostByCategory(category, mergedData, req.file)

    if (updates.imgSrc === null && post.imgSrc) {
        await deleteFromCloudinary(post.imgSrc)
        post.imgSrc = null
    } else if (req.file) {
        if (post.imgSrc) await deleteFromCloudinary(post.imgSrc)
        post.imgSrc = await uploadToCloudinary(req.file, 'posts')
    }

    if (updates.videoSrc !== undefined) {
        if (updates.videoSrc === null) {
            updates.videoSrc = null
        } else {
            const embed = getYouTubeEmbedUrl(updates.videoSrc)
            if (!embed) throw createError('Invalid YouTube URL', 400)
            updates.videoSrc = embed
        }
    }

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

    if (post.imgSrc) {
        await deleteFromCloudinary(post.imgSrc)
    }

    await post.deleteOne()

    return sendResponse(res, {
        message: 'Post deleted',
        data: null
    })
})

const searchPosts = async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ message: 'Query is required' });
    }

    try {
        const results = await Post.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { postContent: { $regex: q, $options: 'i' } }
            ]
        })
            .populate('user')
            .populate('postCategory')
            .lean();

        const formatted = results.map(post => ({
            ...post,
            id: post._id.toString(),
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: 'Search failed' });
    }
};

module.exports = {
    getAllPosts,
    getAllPostsAdmin,
    getSinglePost,
    createNewPost,
    updatePost,
    updatePostPartial,
    deletePost,
    searchPosts
}