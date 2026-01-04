require('dotenv').config();

const { connectDb } = require('./config/db');
const { createApp } = require('./app');

const app = createApp();

const port = Number(process.env.PORT || 4000);

async function start() {
  await connectDb(process.env.MONGO_URI);
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
