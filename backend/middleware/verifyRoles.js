const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const hasPermission = req.user.roles.some(role =>
      allowedRoles.includes(role)
    )

    if (!hasPermission) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' })
    }

    next()
  }
}

module.exports = verifyRoles