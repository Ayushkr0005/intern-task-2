const express = require('express');
const mongoose = require('mongoose');
const { z } = require('zod');

const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const enrollSchema = z.object({
  courseId: z.string().min(1),
});

const progressSchema = z.object({
  lessonId: z.string().min(1),
  completed: z.boolean(),
});

router.post('/', requireAuth, async (req, res) => {
  const parsed = enrollSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const { courseId } = parsed.data;
  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const course = await Course.findById(courseId).select('_id');
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  try {
    const enrollment = await Enrollment.create({
      userId: req.user.sub,
      courseId: course._id,
      progress: {},
      enrolledAt: new Date(),
    });
    return res.status(201).json({ enrollment });
  } catch (err) {
    if (err && err.code === 11000) {
      const existing = await Enrollment.findOne({ userId: req.user.sub, courseId });
      return res.status(200).json({ enrollment: existing });
    }
    throw err;
  }
});

router.get('/me', requireAuth, async (req, res) => {
  const enrollments = await Enrollment.find({ userId: req.user.sub })
    .populate('courseId', 'title slug price category difficulty thumbnailUrl')
    .sort({ enrolledAt: -1 });

  return res.json({ enrollments });
});

router.put('/:id/progress', requireAuth, async (req, res) => {
  const parsed = progressSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const enrollment = await Enrollment.findOne({ _id: req.params.id, userId: req.user.sub });
  if (!enrollment) {
    return res.status(404).json({ message: 'Enrollment not found' });
  }

  enrollment.progress.set(parsed.data.lessonId, parsed.data.completed);
  await enrollment.save();
  return res.json({ enrollment });
});

module.exports = router;
