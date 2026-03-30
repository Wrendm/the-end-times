const User = require('../models/User')
const Post = require('../models/Post')
const Category = require('../models/Category')
const { mapCategory } = require('../utils/mappers/categoryMapper')
const createError = require('../utils/createError')
const sendResponse = require('../utils/sendResponse')
const asyncHandler = require('express-async-handler')

// @desc -> all categories
// @route GET /categories
const getAllCategories = asyncHandler(async (req, res) => {
    const { postType } = req.query

    const filter = {
        published: true,
        ...(postType && { postType })
    }

    const categories = await Category.find(filter).lean()

    return sendResponse(res, {
        message: 'Categories fetched',
        data: categories.map(mapCategory)
    })
})
// @desc -> all categories (admin)
// @route GET /admin/categories
const getAllCategoriesAdmin = asyncHandler(async (req, res) => {
    const { postType } = req.query

    const filter = {
        ...(postType && { postType })
    }

    const categories = await Category.find(filter).lean()

    return sendResponse(res, {
        message: 'Categories fetched',
        data: categories.map(mapCategory)
    })
})
// @desc -> single category
// @route GET /categories/:id 
const getSingleCategory = asyncHandler(async (req, res) => {
    const { id } = req.validated.params
    const category = await Category.findById(id).lean()

    if (!category) {
        throw createError('Category not found', 404)
    }

    return sendResponse(res, {
        message: 'Category fetched',
        data: mapCategory(category)
    })

})

// @desc -> create (unpublished) category
// @route POST /categories
const createNewCategory = asyncHandler(async (req, res) => {
    const { name, type, published } = req.validated.body

    const dbUser = await User.findById(req.user.id)
    if (!dbUser) {
        throw createError('User not found', 404)
    }

    const duplicate = await Category.findOne({ name }).lean()
    if (duplicate) {
        throw createError('Duplicate name not allowed', 409)
    }

    const category = await Category.create({
        name,
        type,
        published
    })

    return sendResponse(res, {
        status: 201,
        message: `Category created`,
        data: mapCategory(category)
    })
})

// @desc update categories (admin)
// @route PUT /admin/categories/:id
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.validated.params
    const { name, published } = req.validated.body

    const category = await Category.findById(id)
    if (!category) {
        throw createError(`Category not found`, 404)
    }

    const duplicate = await Category.findOne({ name, _id: { $ne: id } }).lean()
    if (duplicate) {
        throw createError('Duplicate name not allowed', 409)
    }

    category.name = name
    category.published = published

    const updatedCategory = await category.save()

    return sendResponse(res, {
        message: 'Category updated',
        data: mapCategory(updatedCategory)
    })
})

// @desc update categories partially (admin)
// @route PATCH /admin/categories/:id
const updateCategoryPartial = asyncHandler(async (req, res) => {
    const { id } = req.validated.params
    const updates = req.validated.body

    const category = await Category.findById(id)
    if (!category) {
        throw createError(`Category not found`, 404)
    }

    const allowedFields = ['name', 'published'] // type is not allowed

    if (updates.name) {
        const duplicate = await Category.findOne({
            name: updates.name,
            _id: { $ne: id }
        }).lean()
        if (duplicate) {
            throw createError('Duplicate name not allowed', 409)
        }
    }

    if (updates.type !== undefined) {
        throw createError('Category type cannot be changed', 400)
    }

    Object.keys(updates).forEach(key => {
        if (!allowedFields.includes(key)) {
            throw createError(`Invalid field: ${key}`, 400)
        }
        category[key] = updates[key]
    })

    const updatedCategory = await category.save()

    return sendResponse(res, {
        message: 'Category updated',
        data: mapCategory(updatedCategory)
    })
})

// @desc delete categories (admin)
// @route DELETE /admin/categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.validated.params
    const category = await Category.findById(id)
    if (!category) {
        throw createError(`Category not found`, 404)
    }

    const post = await Post.findOne({ postCategory: id }).lean()
    if (post) {
        throw createError('Category has posts that need to be deleted or recategorized first', 409)
    }

    await category.deleteOne()

    return sendResponse(res, {
        message: 'Category deleted',
        data: null
    })
})

module.exports = {
    getAllCategories,
    getAllCategoriesAdmin,
    getSingleCategory,
    createNewCategory,
    updateCategory,
    updateCategoryPartial,
    deleteCategory
}