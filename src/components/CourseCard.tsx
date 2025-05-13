import React from 'react';
import Link from 'next/link';

interface CourseCardProps {
  courseId: string;
  title: string;
  description: string;
  credits: number;
  prerequisites?: string[];
  semester?: string[];
}

export default function CourseCard({ courseId, title, description, credits, prerequisites, semester }: CourseCardProps) {
  return (
    <Link href={`/courses/${courseId.toLowerCase()}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-purple-700">{courseId}</h2>
          <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded">
            {credits} credits
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {description}
        </p>

        <div className="space-y-2">
          {prerequisites && prerequisites.length > 0 && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Prerequisites: </span>
              <span className="text-gray-600">{prerequisites.join(', ')}</span>
            </div>
          )}
          
          {semester && semester.length > 0 && (
            <div className="text-sm">
              <span className="font-medium text-gray-700">Offered in: </span>
              <span className="text-gray-600">{semester.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
