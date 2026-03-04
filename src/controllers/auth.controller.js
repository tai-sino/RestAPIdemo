const authService = require('../services/auth.service');
const AppError = require('../utils/app-error');
const { sendSuccess } = require('../utils/response');

function validateRegisterPayload(body) {
  const errors = {};

  if (!body.name || String(body.name).trim().length < 2) {
    errors.name = ['Name is required and must be at least 2 characters.'];
  }

  if (!body.email || !String(body.email).includes('@')) {
    errors.email = ['A valid email is required.'];
  }

  if (!body.password || String(body.password).length < 6) {
    errors.password = ['Password is required and must be at least 6 characters.'];
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError('Validation failed.', 422, errors);
  }
}

function validateLoginPayload(body) {
  const errors = {};

  if (!body.email || !String(body.email).includes('@')) {
    errors.email = ['A valid email is required.'];
  }

  if (!body.password || String(body.password).length < 6) {
    errors.password = ['Password must be at least 6 characters.'];
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError('Validation failed.', 422, errors);
  }
}

function register(req, res, next) {
  try {
    validateRegisterPayload(req.body);
    const user = authService.registerUser({
      name: String(req.body.name).trim(),
      email: String(req.body.email).trim().toLowerCase(),
      password: String(req.body.password),
    });

    return sendSuccess(res, 'Register successful.', user, 201);
  } catch (error) {
    return next(error);
  }
}

function login(req, res, next) {
  try {
    validateLoginPayload(req.body);
    const authPayload = authService.loginUser({
      email: String(req.body.email).trim().toLowerCase(),
      password: String(req.body.password),
    });
    return sendSuccess(res, 'Login successful.', authPayload);
  } catch (error) {
    return next(error);
  }
}

function me(req, res, next) {
  try {
    return sendSuccess(res, 'User profile fetched.', req.user);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  me,
};
