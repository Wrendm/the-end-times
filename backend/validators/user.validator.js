const Joi = require('joi');

const rolesEnum = ['Contributor', 'Admin', 'Editor'];

// Schema for POST
const createUserSchema = Joi.object({
  name: Joi.string().min(1).required(),
  username: Joi.string().min(4).max(25).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  roles: Joi.array().items(Joi.string().valid(...rolesEnum)).default(['Contributor'])
});

// Schema for PUT or PATCH
const updateUserSchema = Joi.object({
  name: Joi.string().min(1).optional(),
  username: Joi.string().min(4).max(25).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional(),
  roles: Joi.array().items(Joi.string().valid(...rolesEnum)).optional()
});

// Schema to validate :id route parameters
const userIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required() // ensures valid Mongo ObjectId
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema
};