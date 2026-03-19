const asyncHandler = require('express-async-handler')

const checkOwnership = (Model, ownerField = 'user') =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const resource = await Model.findById(id)
    if (!resource) {
      res.status(404)
      throw new Error('Resource not found')
    }

    const isOwner = resource[ownerField]?.toString() === req.user.id
    const isAdmin = req.roles.includes('Admin')

    if (!isOwner && !isAdmin) {
      res.status(403)
      throw new Error('User does not have credentials for this action')
    }

    req.resource = resource

    next()
  })

module.exports = checkOwnership