"use client";

import { useState, useEffect } from 'react';
import CourseCard from '@/components/CourseCard';
import CourseCardSkeleton from '@/components/CourseCardSkeleton';
import { ICourse } from '@/models/Course';

export default function CoursesPage() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'credits'>('name');

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch('/api/courses');
        if (!res.ok) throw new Error('Failed to fetch courses');
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    }
    fetchCourses();
  }, []);

  // Filter and sort courses
  const filteredCourses = courses
    .filter(course => 
      course.courseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'credits') {
        return b.credits - a.credits;
      }
      return a.courseId.localeCompare(b.courseId);
    });

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-purple-700 mb-2">ECE Courses</h1>
          <p className="text-gray-600">Browse through our comprehensive list of Electrical and Computer Engineering courses</p>
        </header>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'credits')}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="name">Sort by Name</option>
            <option value="credits">Sort by Credits</option>
          </select>
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard 
                key={course.courseId}
                courseId={course.courseId}
                title={course.title}
                description={course.description}
                credits={course.credits}
                prerequisites={course.prerequisites}
                semester={course.semester}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
