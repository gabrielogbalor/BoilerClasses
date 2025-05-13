const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const Course = require(path.resolve(__dirname, '../src/models/Course')).default;
const connectToDatabase = require(path.resolve(__dirname, '../src/lib/mongoose')).default;

async function seed() {
  try {
    await connectToDatabase();

    const filePath = path.join(__dirname, 'data', 'ece_courses.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const courses = JSON.parse(jsonData);

    await Course.deleteMany(); // clear existing
    const result = await Course.insertMany(courses);

    console.log(`✅ Successfully inserted ${result.length} courses.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
