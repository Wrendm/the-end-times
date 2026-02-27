const express = require('express')
const router = express.Router()

const postsController = require('../controllers/posts.controller') 
const validate = require('../validators/validate')
const { createPostSchema, updatePostSchema, postIdParamSchema } = require('../validators/post.validator')


router.route('/')
  .get(postsController.getAllPosts)
  .post(validate(createPostSchema), postsController.createNewPost);


router.route('/:id')
  .get(validate(postIdParamSchema, 'params'), postsController.getSinglePost)
  .put(
    validate(postIdParamSchema, 'params'),
    validate(updatePostSchema),
    postsController.updatePost
  )
  .patch(
    validate(postIdParamSchema, 'params'),
    validate(updatePostSchema),
    postsController.updatePostPartial
  )
  .delete(validate(postIdParamSchema, 'params'), postsController.deletePost);

module.exports = router