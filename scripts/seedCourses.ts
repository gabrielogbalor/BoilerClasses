import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { connectToDatabase } from '../src/lib/mongoose';
import { Course } from '../src/models/Course';

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local
const envPath = path.resolve(__dirname, '../.env.local');
dotenv.config({ path: envPath });

async function seed() {
  try {
    console.log('⚙️ Connecting to MongoDB...');
    await connectToDatabase();
    console.log('✅ Connected to MongoDB.');

    // Load JSON data
    const filePath = path.join(__dirname, 'data', 'ece_courses.json');
    console.log(`📄 Reading JSON from: ${filePath}`);
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const courses = JSON.parse(rawData);

    console.log('🧹 Deleting existing Course documents...');
    await Course.deleteMany({});

    console.log(`🚀 Inserting ${courses.length} new courses...`);
    const result = await Course.insertMany(courses);

    console.log(`✅ Successfully inserted ${result.length} courses.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    if (error instanceof Error) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

seed();