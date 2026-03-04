const AppError = require('../utils/app-error');

function requireRole(expectedRole) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError('Unauthorized.', 401));
    }

    if (req.user.role !== expectedRole) {
      return next(new AppError('Forbidden. Insufficient role.', 403));
    }

    return next();
  };
}

module.exports = {
  requireRole,
};
