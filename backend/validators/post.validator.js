const Joi = require('joi')

// Reusable ObjectId validator
const objectId = Joi.string().hex().length(24)

// Schema for POST
const createPostSchema = Joi.object({
  postType: Joi.string().required(),
  postCategory: Joi.string().required(),
  title: Joi.string().required(),
  imgSrc: Joi.string().allow('').optional(),
  postContent: Joi.string().allow('').optional(),
  published: Joi.boolean().required()
}).unknown(false)

const updatePostPutSchema = Joi.object({
  postType: Joi.string().required(),
  postCategory: Joi.string().required(),
  title: Joi.string().required(),
  imgSrc: Joi.string().allow('').required(),
  postContent: Joi.string().allow('').required(),
  published: Joi.boolean().required()
}).unknown(false)


const updatePostPatchSchema = Joi.object({
  postType: Joi.string(),
  postCategory: Joi.string(),
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
  user: Joi.string().hex().length(24).optional()
}).unknown(false)

module.exports = {
  createPostSchema,
  updatePostPutSchema,
  updatePostPatchSchema,
  postIdParamSchema,
  postQuerySchema
}