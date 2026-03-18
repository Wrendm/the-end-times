const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userRoles = req.user.roles.map(r => r.toLowerCase());
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

    const hasPermission = userRoles.some(role =>
      normalizedAllowed.includes(role)
    );

    if (!hasPermission) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }

    next();
  };
};

module.exports = verifyRoles;