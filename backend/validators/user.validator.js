const Joi = require('joi');

const rolesEnum = ['Contributor', 'Admin', 'Editor'];

// Schema for POST
const createUserSchema = Joi.object({
  username: Joi.string().trim().min(4).max(25),
  name: Joi.string().trim().min(2),
  email: Joi.string().trim().email(),
  password: Joi.string().min(8).required(),
}).unknown(false)


const updateUserPutSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  username: Joi.string().trim().min(4).max(25).required(),
  email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).required(),
  roles: Joi.array()
    .items(Joi.string().valid(...rolesEnum))
    .min(1)
    .required()
})
.unknown(false)

const updateUserPatchSchema = Joi.object({
  name: Joi.string().trim().min(1),
  username: Joi.string().trim().min(4).max(25),
  email: Joi.string().trim().email({ tlds: { allow: false } }),
  password: Joi.string().min(8),
  roles: Joi.array().items(Joi.string().valid(...rolesEnum)).min(1)
})
.min(1)
.unknown(false)

const updateRolesSchema = Joi.object({
  roles: Joi.array()
    .items(Joi.string().valid(...rolesEnum))
    .min(1)
    .required()
})
.unknown(false)

// Schema to validate :id route parameters
const userIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required() // ensures valid Mongo ObjectId
})

module.exports = {
  createUserSchema,
  updateUserPutSchema,
  updateUserPatchSchema,
  updateRolesSchema,
  userIdParamSchema
}