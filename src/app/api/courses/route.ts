import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Course } from '@/models/Course';

export async function GET() {
  try {
    await connectToDatabase();
    const courses = await Course.find({}).sort({ courseId: 1 });
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
