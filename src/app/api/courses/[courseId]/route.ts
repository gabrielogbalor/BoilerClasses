import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Course } from '@/models/Course';

export async function GET(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    await connectToDatabase();
    const course = await Course.findOne({ 
      courseId: params.courseId.toUpperCase() 
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Failed to fetch course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
} 