const mongoose = require('mongoose');

async function connectDb(mongoUri) {
  if (!mongoUri) {
    throw new Error('MONGO_URI is required');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri);
}

module.exports = { connectDb };
