const jwt = require('jsonwebtoken');
const { getUserById } = require('../services/auth.service');
const AppError = require('../utils/app-error');

function parseBearerToken(authHeader) {
  if (!authHeader) {
    return null;
  }

  const [type, token] = authHeader.split(' ');
  if (type !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

function requireAuth(req, _res, next) {
  try {
    const token = parseBearerToken(req.headers.authorization);
    if (!token) {
      throw new AppError('Unauthorized. Missing or invalid token.', 401);
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || 'change_me_in_real_project');
    const user = getUserById(payload.sub);
    if (!user) {
      throw new AppError('Unauthorized. User not found.', 401);
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Unauthorized. Token is invalid or expired.', 401));
    }
    return next(error);
  }
}

module.exports = {
  requireAuth,
};
