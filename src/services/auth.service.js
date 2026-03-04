const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, run } = require('../db/sqlite');
const AppError = require('../utils/app-error');

function nowIso() {
  return new Date().toISOString();
}

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

function getUserById(id) {
  const user = query('SELECT * FROM users WHERE id = ?', [id])[0];
  return sanitizeUser(user);
}

function registerUser({ name, email, password }) {
  const existingUser = query('SELECT id FROM users WHERE email = ?', [email])[0];
  if (existingUser) {
    throw new AppError('Email already exists.', 422, {
      email: ['This email is already registered.'],
    });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const now = nowIso();
  const result = run(
    `
      INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
      VALUES (?, ?, ?, 'user', ?, ?)
    `,
    [name, email, passwordHash, now, now]
  );

  return getUserById(result.lastInsertId);
}

function loginUser({ email, password }) {
  const user = query('SELECT * FROM users WHERE email = ?', [email])[0];
  if (!user) {
    throw new AppError('Invalid credentials.', 401);
  }

  const matched = bcrypt.compareSync(password, user.password_hash);
  if (!matched) {
    throw new AppError('Invalid credentials.', 401);
  }

  const secret = process.env.JWT_SECRET || 'change_me_in_real_project';
  const expiresIn = process.env.JWT_EXPIRES_IN || '2h';
  const token = jwt.sign(
    {
      role: user.role,
      email: user.email,
    },
    secret,
    {
      subject: String(user.id),
      expiresIn,
    }
  );

  return {
    access_token: token,
    token_type: 'Bearer',
    expires_in: expiresIn,
    user: sanitizeUser(user),
  };
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
};
