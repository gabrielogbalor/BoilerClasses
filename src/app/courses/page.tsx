import CourseCard from '@/components/CourseCard';

export default function CoursesPage() {
  return (
    <main className="min-h-screen px-4 py-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">All Courses</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CourseCard 
          code="ECE 368" 
          title="Data Structures and Algorithms" 
          description="Learn about graphs, trees, hash maps and sorting algorithms." 
          rating={2.1}
        />
        <CourseCard 
          code="ECE 20875" 
          title="Python for Data Science" 
          description="Intro to Python and data manipulation using pandas, numpy, and matplotlib." 
          rating={4.8}
        />
      </div>
    </main>
  );
}
