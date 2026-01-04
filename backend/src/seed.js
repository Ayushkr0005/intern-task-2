require('dotenv').config();

const bcrypt = require('bcrypt');

const { connectDb } = require('./config/db');
const User = require('./models/User');
const Course = require('./models/Course');

async function seedAdmin() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin12345';
  const adminName = process.env.SEED_ADMIN_NAME || 'Admin';

  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    return existing;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const admin = await User.create({
    name: adminName,
    email: adminEmail,
    passwordHash,
    role: 'admin',
  });

  return admin;
}

async function seedCourses() {
  const samples = [
    {
      title: 'React Fundamentals',
      slug: 'react-fundamentals',
      description: 'Learn components, props, state, and hooks by building small UI features.',
      price: 0,
      category: 'Web',
      difficulty: 'Beginner',
      thumbnailUrl: '',
      lessons: [
        { title: 'Welcome', contentHtml: '<p>Welcome to React Fundamentals.</p>', order: 0 },
        { title: 'Components & Props', contentHtml: '<p>Learn how to build reusable components.</p>', order: 1 },
        { title: 'State & Events', contentHtml: '<p>Handle user interactions with state.</p>', order: 2 },
      ],
    },
    {
      title: 'Node + Express API',
      slug: 'node-express-api',
      description: 'Build REST APIs with Express, middleware, and best practices.',
      price: 299,
      category: 'Backend',
      difficulty: 'Intermediate',
      thumbnailUrl: '',
      lessons: [
        { title: 'Project Setup', contentHtml: '<p>Initialize your Express project.</p>', order: 0 },
        { title: 'Routing', contentHtml: '<p>Learn how to design routes.</p>', order: 1 },
        { title: 'MongoDB with Mongoose', contentHtml: '<p>Persist data with MongoDB.</p>', order: 2 },
      ],
    },
    {
      title: 'Fullstack Auth with JWT',
      slug: 'fullstack-auth-jwt',
      description: 'Implement secure auth with JWT cookies and role-based access control.',
      price: 499,
      category: 'Security',
      difficulty: 'Advanced',
      thumbnailUrl: '',
      lessons: [
        { title: 'Threat Model', contentHtml: '<p>Understand common auth threats.</p>', order: 0 },
        { title: 'JWT Cookies', contentHtml: '<p>Use httpOnly cookies to store tokens.</p>', order: 1 },
        { title: 'RBAC', contentHtml: '<p>Protect admin routes with roles.</p>', order: 2 },
      ],
    },
  ];

  for (const course of samples) {
    await Course.findOneAndUpdate({ slug: course.slug }, { $setOnInsert: course }, { upsert: true, new: true });
  }
}

async function main() {
  await connectDb(process.env.MONGO_URI);

  const admin = await seedAdmin();
  await seedCourses();

  console.log('Seed complete');
  console.log(`Admin email: ${admin.email}`);
  console.log(`Admin password: ${process.env.SEED_ADMIN_PASSWORD || 'admin12345'}`);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
