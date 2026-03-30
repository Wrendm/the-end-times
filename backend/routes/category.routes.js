const express = require('express')
const router = express.Router()

const categoriesController = require('../controllers/categories.controller')
const verifyJWT = require('../middleware/verifyJWT')
const validate = require('../validators/validate')
const { createCategorySchema, categoryIdParamSchema } = require('../validators/category.validator')

router.route('/')
  .get(categoriesController.getAllCategories)
  .post(
    verifyJWT,
    validate(createCategorySchema, 'body'),
    categoriesController.createNewCategory
  )

router.route('/:id')
  .get(
    validate(categoryIdParamSchema, 'params'),
    categoriesController.getSingleCategory
  )

module.exports = router