const Joi = require('joi')

// Reusable ObjectId validator
const objectId = Joi.string().hex().length(24)

// Schema for POST
const createPostSchema = Joi.object({
  user: objectId.required(),   // Used for dev, this will be removed once authentication is added
  postType: Joi.string().required(),
  postCategory: Joi.string().required(),
  title: Joi.string().required(),
  imgSrc: Joi.string().allow('').optional(),
  postContent: Joi.string().allow('').optional(),
  published: Joi.boolean().required()
})

// Schema for PUT or PATCH
const updatePostSchema = Joi.object({
  user: objectId.optional(),   // Used for dev, this will be removed once authentication is added
  postType: Joi.string().optional(),
  postCategory: Joi.string().optional(),
  title: Joi.string().optional(),
  imgSrc: Joi.string().allow('').optional(),
  postContent: Joi.string().allow('').optional(),
  published: Joi.boolean().optional()
})

// Schema to validate :id route parameters
const postIdParamSchema = Joi.object({
  id: objectId.required()
})

module.exports = {
  createPostSchema,
  updatePostSchema,
  postIdParamSchema
}