import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Course from '@/models/Course';

export async function GET() {
  try {
    await connectToDatabase();
    const courses = await Course.find({});
    return NextResponse.json(courses);
  } catch (error) {
    console.error('[GET /api/courses] Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
