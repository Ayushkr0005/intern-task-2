const jwt = require('jsonwebtoken');

function signAccessToken(payload, secret, expiresIn) {
  if (!secret) throw new Error('JWT_SECRET is required');
  return jwt.sign(payload, secret, { expiresIn });
}

function verifyToken(token, secret) {
  if (!secret) throw new Error('JWT_SECRET is required');
  return jwt.verify(token, secret);
}

module.exports = { signAccessToken, verifyToken };
