const express = require('express')
const router = express.Router()

const postsController = require('../controllers/posts.controller')
const usersController = require('../controllers/users.controller')
const categoriesController = require('../controllers/categories.controller')

const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles')

const validate = require('../validators/validate')
const { postQuerySchema } = require('../validators/post.validator')
const { updateRolesSchema, userIdParamSchema } = require('../validators/user.validator')
const { updateCategoryPutSchema, updateCategoryPatchSchema, categoryIdParamSchema } = require('../validators/category.validator')

router.use(verifyJWT);
router.use(verifyRoles('Admin'));

//posts
router.route('/posts')
    .get(validate(postQuerySchema, 'query'), postsController.getAllPostsAdmin)

//users
router.route('/users')
    .get(usersController.getAllUsersAdmin)

router.route('/users/:id/roles')
    .patch(
        validate(userIdParamSchema, 'params'),
        validate(updateRolesSchema, 'body'),
        usersController.updateRoles
    )

//categories
router.route('/categories')
    .get(categoriesController.getAllCategoriesAdmin)

router.route('/categories/:id')
    .get(
        validate(categoryIdParamSchema, 'params'),
        categoriesController.getSingleCategory
    )
    .put(
        validate(categoryIdParamSchema, 'params'),
        validate(updateCategoryPutSchema, 'body'),
        categoriesController.updateCategory
    )
    .patch(
        validate(categoryIdParamSchema, 'params'),
        validate(updateCategoryPatchSchema, 'body'),
        categoriesController.updateCategoryPartial
    )
    .delete(
        validate(categoryIdParamSchema, 'params'),
        categoriesController.deleteCategory
    )

module.exports = router