const Joi = require('joi');

const rolesEnum = ['Contributor', 'Admin', 'Editor'];

// Schema for POST
const createUserSchema = Joi.object({
  username: Joi.string().trim().min(4).max(25).required(),
  name: Joi.string().trim().min(2).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(8).required()
}).unknown(false)


const updateUserPutSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  username: Joi.string().trim().min(4).max(25).required(),
  email: Joi.string().trim().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(8).required()
})
.unknown(false)

const updateUserPatchSchema = Joi.object({
  name: Joi.string().trim().min(1),
  username: Joi.string().trim().min(4).max(25),
  email: Joi.string().trim().email({ tlds: { allow: false } }),
  password: Joi.string().min(8)
})
.min(1)
.unknown(false)

const updateRolesSchema = Joi.object({
  roles: Joi.array()
    .items(Joi.string().valid(...rolesEnum))
    .min(1)
    .unique()
    .required()
}).unknown(false)

// Schema to validate :id route parameters
const userIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required() // ensures valid Mongo ObjectId
})

const usersQuerySchema = Joi.object({
  search: Joi.string().trim().min(1),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100)
}).unknown(false)

module.exports = {
  createUserSchema,
  updateUserPutSchema,
  updateUserPatchSchema,
  updateRolesSchema,
  userIdParamSchema,
  usersQuerySchema
}