const express = require('express');
const mongoose = require('mongoose');
const { z } = require('zod');

const Course = require('../models/Course');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const lessonSchema = z.object({
  title: z.string().min(1).max(200),
  contentHtml: z.string().min(1),
  videoUrl: z.string().url().optional(),
  order: z.number().int().nonnegative(),
});

const createCourseSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  category: z.string().min(1).max(100),
  difficulty: z.string().min(1).max(50),
  thumbnailUrl: z.string().url().optional(),
  lessons: z.array(lessonSchema).optional(),
});

const updateCourseSchema = createCourseSchema.partial();

router.get('/', async (req, res) => {
  const { category, difficulty, price, search } = req.query;

  const query = {};
  if (typeof category === 'string' && category.trim()) query.category = category.trim();
  if (typeof difficulty === 'string' && difficulty.trim()) query.difficulty = difficulty.trim();

  if (typeof price === 'string' && price.trim()) {
    const n = Number(price);
    if (!Number.isNaN(n)) query.price = { $lte: n };
  }

  if (typeof search === 'string' && search.trim()) {
    query.$or = [
      { title: { $regex: search.trim(), $options: 'i' } },
      { description: { $regex: search.trim(), $options: 'i' } },
    ];
  }

  const courses = await Course.find(query)
    .select('title slug description price category difficulty thumbnailUrl createdAt')
    .sort({ createdAt: -1 });

  return res.json({ courses });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const filter = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };
  const course = await Course.findOne(filter);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  return res.json({ course });
});

router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const parsed = createCourseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const course = await Course.create({
      ...parsed.data,
      slug: parsed.data.slug.toLowerCase(),
    });
    return res.status(201).json({ course });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Slug already in use' });
    }
    throw err;
  }
});

router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const parsed = updateCourseSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const update = { ...parsed.data };
  if (typeof update.slug === 'string') update.slug = update.slug.toLowerCase();

  try {
    const course = await Course.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    return res.json({ course });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'Slug already in use' });
    }
    throw err;
  }
});

router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  return res.json({ ok: true });
});

module.exports = router;
