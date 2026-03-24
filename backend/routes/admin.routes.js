const express = require('express')
const router = express.Router()

const postsController = require('../controllers/posts.controller')
const usersController = require('../controllers/users.controller')

const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles')

const validate = require('../validators/validate')
const { postQuerySchema } = require('../validators/post.validator')
const { updateRolesSchema, userIdParamSchema } = require('../validators/user.validator')

router.use(verifyJWT);
router.use(verifyRoles('Admin'));

router.get('/posts', validate(postQuerySchema, 'query'), postsController.getAllPostsAdmin);
router.get('/users', usersController.getAllUsersAdmin);

router.route('/users/:id/roles')
    .patch(
        validate(userIdParamSchema, 'params'),
        validate(updateRolesSchema, 'body'),
        usersController.updateRoles
    )

module.exports = router