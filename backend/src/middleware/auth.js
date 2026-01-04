const { verifyToken } = require('../utils/jwt');

function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const payload = verifyToken(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return next();
  };
}

module.exports = { requireAuth, requireRole };
