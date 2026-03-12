const Joi = require('joi');

const loginSchema = Joi.object({
  username: Joi.string().min(4).max(25).required(),
  password: Joi.string().min(8).required()
});

module.exports = {
  loginSchema
};