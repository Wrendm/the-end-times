const Joi = require('joi')

const objectId = Joi.string().hex().length(24)

const typesEnum = ['Text', 'Image', 'Audio', 'Video']

// Schema for POST
const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string()
    .valid(...typesEnum)
    .required(),
  published: Joi.boolean().default(false)
}).unknown(false)

const updateCategoryPutSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.forbidden(),
  published: Joi.boolean().required()
}).unknown(false)

const updateCategoryPatchSchema = Joi.object({
  name: Joi.string(),
  type: Joi.forbidden(),
  published: Joi.boolean()
})
.min(1)
.unknown(false)

const categoryIdParamSchema = Joi.object({
  id: objectId.required()
})


module.exports = {
  createCategorySchema,
  updateCategoryPutSchema,
  updateCategoryPatchSchema,
  categoryIdParamSchema
}