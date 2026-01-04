const express = require('express');

const User = require('../models/User');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  const users = await User.find({}).select('name email role createdAt').sort({ createdAt: -1 });
  return res.json({ users });
});

module.exports = router;
