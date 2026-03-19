const express = require('express')
const router = express.Router()

const Post = require('../models/Post')
const postsController = require('../controllers/posts.controller') 
const validate = require('../validators/validate')
const { createPostSchema, updatePostSchema, postIdParamSchema } = require('../validators/post.validator')
const verifyJWT = require('../middleware/verifyJWT')
const checkOwnership = require('../middleware/checkOwnership')


router.route('/')
  .get(postsController.getAllPosts)
  .post(verifyJWT, validate(createPostSchema), postsController.createNewPost);


router.route('/:id')
  .get(validate(postIdParamSchema, 'params'), postsController.getSinglePost)
  .put(
    verifyJWT,
    validate(postIdParamSchema, 'params'),
    validate(updatePostSchema),
    checkOwnership(Post),
    postsController.updatePost
  )
  .patch(
    verifyJWT,
    validate(postIdParamSchema, 'params'),
    validate(updatePostSchema),
    checkOwnership(Post),
    postsController.updatePostPartial
  )
  .delete(verifyJWT, 
    validate(postIdParamSchema, 'params'), 
    checkOwnership(Post),
    postsController.deletePost);

module.exports = router