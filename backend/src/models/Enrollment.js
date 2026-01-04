const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    progress: { type: Map, of: Boolean, default: {} },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
