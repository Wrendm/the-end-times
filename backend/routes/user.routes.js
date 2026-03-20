const express = require('express')
const router = express.Router()

const User = require('../models/User')
const usersController = require('../controllers/users.controller')
const validate = require('../validators/validate')
const { createUserSchema, updateUserSchema, userIdParamSchema } = require('../validators/user.validator')
const verifyJWT = require('../middleware/verifyJWT')
const checkOwnership = require('../middleware/checkOwnership')

router.route('/')
  .get(usersController.getAllUsers)
  .post(validate(createUserSchema), usersController.createNewUser);

router.route('/:id')
  .get(validate(userIdParamSchema, 'params'), usersController.getSingleUser)
  .put(
    verifyJWT,
    validate(userIdParamSchema, 'params'),
    validate(updateUserSchema),
    checkOwnership(User, '_id'),
    usersController.updateUser
  )
  .patch(
    verifyJWT,
    validate(userIdParamSchema, 'params'),
    validate(updateUserSchema),
    checkOwnership(User, '_id'),
    usersController.updateUserPartial
  )
  .delete(verifyJWT, 
    validate(userIdParamSchema, 'params'), 
    checkOwnership(User, '_id'),
    usersController.deleteUser);

module.exports = router