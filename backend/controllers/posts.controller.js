const User = require('../models/User')
const Post = require('../models/Post')
const { mapPosts, mapPost } = require('../utils/mappers/postMapper')
const createError = require('../utils/createError')
const isValidObjectId = require('../utils/isValidObjectId')
const asyncHandler = require('express-async-handler')

// @desc -> all posts
// @route GET /posts
const getAllPosts = asyncHandler(async (req, res) => {
    const { postCategory, user } = req.query;

    const filter = {
        ...(postCategory ? { postCategory: { $regex: postCategory, $options: 'i' } } : {}),
        ...(user ? { user } : {}),
        published: true
    };

    const posts = await Post.find(filter).populate('user').lean()

    res.json(mapPosts(posts));
})
// @desc -> all posts (admin)
// @route GET /admin/posts
const getAllPostsAdmin = asyncHandler(async (req, res) => {
    const { postCategory, user } = req.query;

    const filter = {
        ...(postCategory ? { postCategory: { $regex: postCategory, $options: 'i' } } : {}),
        ...(user ? { user } : {})
    };

    const posts = await Post.find(filter).populate('user').lean()

    res.json(mapPosts(posts));
})
// @desc -> single post
// @route GET /posts/:id 
const getSinglePost = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!isValidObjectId(id)) {
        throw createError('Invalid post ID', 400)
    }
    const post = await Post.findById(id).populate('user').lean()

    if (!post) {
        throw createError('Post not found', 404)
    }
    res.json(mapPost(post))
})
//	POST /posts -> create post
const createNewPost = asyncHandler(async (req, res) => {
    const { postType, postCategory, title, imgSrc, postContent, published } = req.body

    if (!isValidObjectId(req.user.id)) {
        throw createError('Invalid user ID in token', 400);
    }

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
    });

    const populatedPost = await post.populate('user')

    res.status(201).json({
        message: `New post ${post.title} created`,
        post: mapPost(populatedPost)
    });
})
//	PUT /posts/:id -> update post
const updatePost = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!isValidObjectId(id)) {
        throw createError('Invalid post ID', 400)
    }
    const { postType, postCategory, title, imgSrc, postContent, published } = req.body

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

    const updatedPost = await post.save();

    await updatedPost.populate('user');

    res.json({
        message: `${updatedPost.title} updated`,
        post: mapPost(updatedPost)
    });
})
//	PATCH /posts/:id -> update post partially
const updatePostPartial = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!isValidObjectId(id)) {
        throw createError('Invalid post ID', 400)
    }
    const updates = req.body

    const post = await Post.findById(id);
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

    const updatedPost = await post.save();

    await updatedPost.populate('user');

    res.json({
        message: `${updatedPost.title} updated`,
        post: mapPost(updatedPost)
    });
})
//	DELETE /posts/:id -> delete post
const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!isValidObjectId(id)) {
        throw createError('Invalid post ID', 400);
    }
    const post = await Post.findById(id)
    if (!post) {
        throw createError(`Post with id ${id} not found`, 404)
    }

    const result = await post.deleteOne()

    res.json({ message: 'Post deleted' })
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