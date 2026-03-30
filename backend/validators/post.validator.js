const Joi = require('joi')

// Reusable ObjectId validator
const objectId = Joi.string().hex().length(24)

// Schema for POST
const createPostSchema = Joi.object({
  postCategory: objectId.required(),
  title: Joi.string().required(),
  imgSrc: Joi.string().allow('').optional(),
  postContent: Joi.string().allow('').optional(),
  published: Joi.boolean().required()
}).unknown(false)

const updatePostPutSchema = Joi.object({
  postCategory: objectId.required(),
  title: Joi.string().required(),
  imgSrc: Joi.string().allow('').required(),
  postContent: Joi.string().allow('').required(),
  published: Joi.boolean().required()
}).unknown(false)

const updatePostPatchSchema = Joi.object({
  postCategory: objectId,
  title: Joi.string(),
  imgSrc: Joi.string().allow(''),
  postContent: Joi.string().allow(''),
  published: Joi.boolean()
})
.min(1)
.unknown(false)

const postIdParamSchema = Joi.object({
  id: objectId.required()
})

const postQuerySchema = Joi.object({
  postCategory: Joi.string().optional(),
  user: Joi.string().optional().allow('')
}).unknown(true)

module.exports = {
  createPostSchema,
  updatePostPutSchema,
  updatePostPatchSchema,
  postIdParamSchema,
  postQuerySchema
}