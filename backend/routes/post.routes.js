const express = require('express')
const router = express.Router()

const postsController = require('../controllers/posts.controller') 
const validate = require('../validators/validate')
const { createPostSchema, updatePostSchema, postIdParamSchema } = require('../validators/post.validator')
const verifyJWT = require('../middleware/verifyJWT')


router.route('/')
  .get(postsController.getAllPosts)
  .post(verifyJWT, validate(createPostSchema), postsController.createNewPost);


router.route('/:id')
  .get(validate(postIdParamSchema, 'params'), postsController.getSinglePost)
  .put(
    verifyJWT,
    validate(postIdParamSchema, 'params'),
    validate(updatePostSchema),
    postsController.updatePost
  )
  .patch(
    verifyJWT,
    validate(postIdParamSchema, 'params'),
    validate(updatePostSchema),
    postsController.updatePostPartial
  )
  .delete(verifyJWT, validate(postIdParamSchema, 'params'), postsController.deletePost);

module.exports = router