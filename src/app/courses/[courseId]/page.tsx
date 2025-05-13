"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { ICourse } from '@/models/Course';
import { IReview } from '@/models/Review';
import ChatBox from '@/components/ChatBox';

interface ReviewFormData {
  name: string;
  comment: string;
  rating: number;
}

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ReviewFormData>({
    name: '',
    comment: '',
    rating: 5
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch course details
        const courseRes = await fetch(`/api/courses/${params.courseId}`);
        if (!courseRes.ok) {
          if (courseRes.status === 404) {
            router.push('/404');
            return;
          }
          throw new Error('Failed to fetch course');
        }
        const courseData = await courseRes.json();
        setCourse(courseData);

        // Fetch reviews
        const reviewsRes = await fetch(`/api/reviews?courseCode=${params.courseId}`);
        if (!reviewsRes.ok) throw new Error('Failed to fetch reviews');
        const reviewsData = await reviewsRes.json();
        setReviews(reviewsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [params.courseId, router]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      alert('Please sign in to submit a review');
      return;
    }

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          courseCode: params.courseId,
          userEmail: session.user?.email
        })
      });

      if (!res.ok) throw new Error('Failed to submit review');
      
      const newReview = await res.json();
      setReviews([...reviews, newReview]);
      setFormData({ name: '', comment: '', rating: 5 });
    } catch (err) {
      alert('Failed to submit review. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error || 'Course not found'}
          </h1>
          <button
            onClick={() => router.push('/courses')}
            className="text-purple-600 hover:text-purple-800"
          >
            ← Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Course Info Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <header className="mb-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-purple-700">{course.courseId}</h1>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                {course.credits} credits
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mt-2">{course.title}</h2>
          </header>

          <section className="prose max-w-none mb-8">
            <p className="text-gray-600">{course.description}</p>
          </section>

          {course.prerequisites && course.prerequisites.length > 0 && (
            <section className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Prerequisites</h3>
              <ul className="list-disc list-inside text-gray-600">
                {course.prerequisites.map((prereq, index) => (
                  <li key={index}>{prereq}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Chat Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChatBox courseCode={params.courseId} />

          {/* Reviews Section */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-semibold mb-6">Reviews</h3>
            
            {session ? (
              <form onSubmit={handleSubmitReview} className="space-y-4 mb-8">
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                  <select
                    id="rating"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  >
                    {[5, 4, 3, 2, 1].map((num) => (
                      <option key={num} value={num}>{num} stars</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Review</label>
                  <textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Submit Review
                </button>
              </form>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg mb-8">
                <p className="text-gray-600 mb-4">Sign in to leave a review</p>
                <button
                  onClick={() => signIn()}
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Sign in now →
                </button>
              </div>
            )}

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id.toString()} className="border-b border-gray-100 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">{review.name}</span>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 text-gray-600">{review.rating}/5</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}