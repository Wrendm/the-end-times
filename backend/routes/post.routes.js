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


router.route('/')
  .get(optionalJWT, validate(postQuerySchema, 'query'), postsController.getAllPosts)
  .post(verifyJWT, uploadImage.single('image'), validate(createPostSchema), postsController.createNewPost)


router.route('/:id')
  .get(
    verifyJWT,
    validate(postIdParamSchema, 'params'),
    postsController.getSinglePost
  )
  .put(
    verifyJWT,
    validate(postIdParamSchema, 'params'),
    checkOwnership(Post),
    uploadImage.single('image'),
    validate(updatePostPutSchema),
    postsController.updatePost
  )
  .patch(
    verifyJWT,
    validate(postIdParamSchema, 'params'),
    checkOwnership(Post),
    uploadImage.single('image'),
    validate(updatePostPatchSchema),
    postsController.updatePostPartial
  )
  .delete(
    verifyJWT,
    validate(postIdParamSchema, 'params'),
    checkOwnership(Post),
    postsController.deletePost
  )

module.exports = router