const asyncHandler = require('express-async-handler')
const createError = require('../utils/createError')

const checkOwnership = (Model, ownerField = 'user') =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params

    if (!req.user) {
      throw createError('Unauthorized', 401)
    }

    const resource = await Model.findById(id)
    if (!resource) {
      throw createError('Resource not found', 404)
    }

    if (!resource[ownerField]) {
      throw createError('Ownership field not found on resource', 500)
    }
 
    const isOwner = resource[ownerField].toString() === req.user.id
    const isAdmin = req.user.roles?.includes('Admin')

    if (!isOwner && !isAdmin) {
      throw createError('Forbidden', 403)
    }

    req.resource = resource
    req.isOwner = isOwner
    req.isAdmin = isAdmin

    next()
  })

module.exports = checkOwnership