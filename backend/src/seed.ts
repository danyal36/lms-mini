import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from './models/User';
import { Course } from './models/Course';
import { Lesson } from './models/Lesson';
import { Enrollment } from './models/Enrollment';

async function seed(): Promise<void> {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Lesson.deleteMany({}),
    Enrollment.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  const instructor = await User.create({
    name: 'Alice Instructor',
    email: 'alice@example.com',
    passwordHash: 'seed_placeholder_not_a_real_hash',
    role: 'instructor',
  });

  const [webDev, nodeApi] = await Course.insertMany([
    {
      title: 'Web Development Fundamentals',
      description: 'Learn HTML, CSS, and JavaScript from scratch.',
      instructor: instructor._id,
      category: 'Web Development',
      published: true,
    },
    {
      title: 'Node.js & Express API Development',
      description: 'Build REST APIs with Node.js, Express, and MongoDB.',
      instructor: instructor._id,
      category: 'Backend',
      published: false,
    },
  ]);

  await Lesson.insertMany([
    { courseId: webDev._id, title: 'HTML Basics', content: 'Introduction to HTML tags and document structure.', order: 1 },
    { courseId: webDev._id, title: 'CSS Fundamentals', content: 'Styling with selectors, box model, and flexbox.', order: 2 },
    { courseId: webDev._id, title: 'JavaScript Essentials', content: 'Variables, functions, and DOM manipulation.', order: 3 },
    { courseId: nodeApi._id, title: 'Node.js Introduction', content: 'Event loop, modules, and npm.', videoUrl: 'https://example.com/node-intro', order: 1 },
    { courseId: nodeApi._id, title: 'Express Routing', content: 'Routes, middleware, and the request/response cycle.', order: 2 },
    { courseId: nodeApi._id, title: 'MongoDB with Mongoose', content: 'Schemas, models, and CRUD operations.', order: 3 },
  ]);

  console.log('\nSeed complete');
  console.log('Instructor id :', instructor._id.toString());
  console.log('Course 1 id   :', webDev._id.toString(), '(published)');
  console.log('Course 2 id   :', nodeApi._id.toString(), '(draft)');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
