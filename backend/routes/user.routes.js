const express = require('express')
const router = express.Router()

const User = require('../models/User')
const usersController = require('../controllers/users.controller')
const validate = require('../validators/validate')
const { createUserSchema, updateUserPutSchema, updateUserPatchSchema, userIdParamSchema, usersQuerySchema } = require('../validators/user.validator')
const verifyJWT = require('../middleware/verifyJWT')
const checkOwnership = require('../middleware/checkOwnership')
const { getLimiter, updateLimiter, deleteLimiter, signupLimiter } = require('../middleware/rateLimit')

router.route('/')
  .get(getLimiter, validate(usersQuerySchema, 'query'), usersController.getAllUsers)
  .post(signupLimiter, validate(createUserSchema), usersController.createNewUser)

router.get('/search', getLimiter, usersController.searchUsers)

router.route('/:id')
  .get(
    getLimiter,
    validate(userIdParamSchema, 'params'),
    usersController.getSingleUser
  )
  .put(
    updateLimiter,
    verifyJWT,
    validate(userIdParamSchema, 'params'),
    validate(updateUserPutSchema, 'body'),
    checkOwnership(User, '_id'),
    usersController.updateUser
  )
  .patch(
    updateLimiter,
    verifyJWT,
    validate(userIdParamSchema, 'params'),
    validate(updateUserPatchSchema, 'body'),
    checkOwnership(User, '_id'),
    usersController.updateUserPartial
  )
  .delete(
    deleteLimiter,
    verifyJWT,
    validate(userIdParamSchema, 'params'),
    checkOwnership(User, '_id'),
    usersController.deleteUser
  )

module.exports = router