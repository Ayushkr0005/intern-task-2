require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const userRoutes = require('./routes/users');

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());

  app.use('/api', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/enroll', enrollmentRoutes);
  app.use('/api/enrollments', enrollmentRoutes);
  app.use('/api/users', userRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  return app;
}

module.exports = { createApp };
