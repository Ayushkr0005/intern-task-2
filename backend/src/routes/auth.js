const express = require('express');
const bcrypt = require('bcrypt');
const { z } = require('zod');

const User = require('../models/User');
const { signAccessToken } = require('../utils/jwt');
const { getAccessTokenCookieOptions } = require('../utils/cookies');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const signupSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  password: z.string().min(6).max(200),
});

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(200),
});

router.post('/signup', async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const { name, email, password } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role: 'user' });

  const token = signAccessToken(
    { sub: String(user._id), role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    '1h'
  );

  res.cookie('accessToken', token, getAccessTokenCookieOptions());
  return res.status(201).json({
    user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
  });
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = signAccessToken(
    { sub: String(user._id), role: user.role, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    '1h'
  );

  res.cookie('accessToken', token, getAccessTokenCookieOptions());
  return res.json({
    user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
  });
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.sub).select('name email role createdAt');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.json({
    user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
  });
});

router.post('/logout', (req, res) => {
  const cookieOptions = getAccessTokenCookieOptions();
  res.clearCookie('accessToken', cookieOptions);
  return res.json({ ok: true });
});

module.exports = router;
