const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    contentHtml: { type: String, required: true },
    videoUrl: { type: String },
    order: { type: Number, required: true },
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    difficulty: { type: String, required: true, trim: true },
    thumbnailUrl: { type: String },
    lessons: { type: [lessonSchema], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model('Course', courseSchema);
