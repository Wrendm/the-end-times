const express = require('express')
const router = express.Router()

const categoriesController = require('../controllers/categories.controller')
const verifyJWT = require('../middleware/verifyJWT')
const { getLimiter, postLimiter } = require('../middleware/rateLimit')
const validate = require('../validators/validate')
const { createCategorySchema, categoryIdParamSchema } = require('../validators/category.validator')

router.route('/')
  .get(getLimiter, categoriesController.getAllCategories)
  .post(
    postLimiter,
    verifyJWT,
    validate(createCategorySchema, 'body'),
    categoriesController.createNewCategory
  )

router.route('/:id')
  .get(
    getLimiter,
    validate(categoryIdParamSchema, 'params'),
    categoriesController.getSingleCategory
  )

module.exports = router