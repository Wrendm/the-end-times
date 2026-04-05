const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
const postsController = require('../controllers/posts.controller')
const validate = require('../validators/validate')
const { createPostSchema, updatePostPutSchema, updatePostPatchSchema, postIdParamSchema, postQuerySchema } = require('../validators/post.validator')
const verifyJWT = require('../middleware/verifyJWT')
const optionalJWT = require('../middleware/optionalJWT')
const checkOwnership = require('../middleware/checkOwnership')
const uploadImage = require('../middleware/uploadImage')
const { getLimiter, postLimiter, updateLimiter, deleteLimiter } = require('../middleware/rateLimit')


router.route('/')
  .get(getLimiter, optionalJWT, validate(postQuerySchema, 'query'), postsController.getAllPosts)
  .post(postLimiter, verifyJWT, uploadImage.single('image'), validate(createPostSchema), postsController.createNewPost)


router.route('/:id')
  .get(
    getLimiter,
    verifyJWT,
    validate(postIdParamSchema, 'params'),
    postsController.getSinglePost
  )
  .put(
    updateLimiter,
    verifyJWT,
    validate(postIdParamSchema, 'params'),
    checkOwnership(Post),
    uploadImage.single('image'),
    validate(updatePostPutSchema),
    postsController.updatePost
  )
  .patch(
    updateLimiter,
    verifyJWT,
    validate(postIdParamSchema, 'params'),
    checkOwnership(Post),
    uploadImage.single('image'),
    validate(updatePostPatchSchema),
    postsController.updatePostPartial
  )
  .delete(
    deleteLimiter,
    verifyJWT,
    validate(postIdParamSchema, 'params'),
    checkOwnership(Post),
    postsController.deletePost
  )

module.exports = router