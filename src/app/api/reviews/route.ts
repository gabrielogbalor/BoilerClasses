import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Review } from '@/models/Review';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const review = await Review.create(data);
    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const courseCode = searchParams.get('courseCode');

    if (!courseCode) {
      return NextResponse.json(
        { error: 'Course code is required' },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ courseCode })
      .sort({ createdAt: -1 })
      .exec();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
