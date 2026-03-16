const express = require('express')
const router = express.Router()

const usersController = require('../controllers/users.controller')
const validate = require('../validators/validate')
const { createUserSchema, updateUserSchema, userIdParamSchema } = require('../validators/user.validator')
const verifyJWT = require('../middleware/verifyJWT')

router.route('/')
  .get(usersController.getAllUsers)
  .post(validate(createUserSchema), usersController.createNewUser);

router.route('/:id')
  .get(validate(userIdParamSchema, 'params'), usersController.getSingleUser)
  .put(
    verifyJWT,
    validate(userIdParamSchema, 'params'),
    validate(updateUserSchema),
    usersController.updateUser
  )
  .patch(
    verifyJWT,
    validate(userIdParamSchema, 'params'),
    validate(updateUserSchema),
    usersController.updateUserPartial
  )
  .delete(verifyJWT, validate(userIdParamSchema, 'params'), usersController.deleteUser);

module.exports = router