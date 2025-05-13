import CourseCard from '@/components/CourseCard';
import { ICourse } from '@/models/Course';

async function getCourses() {
  try {
    const res = await fetch('http://localhost:3000/api/courses', {
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  } catch (error) {
    console.error('Error loading courses:', error);
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main className="min-h-screen px-4 py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-purple-700">ECE Courses</h1>
          <p className="text-gray-600 mt-2">
            Browse through our comprehensive list of Electrical and Computer Engineering courses
          </p>
        </header>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No courses found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: ICourse) => (
              <CourseCard key={course.courseId} {...course} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
