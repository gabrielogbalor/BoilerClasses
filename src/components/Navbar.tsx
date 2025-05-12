'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="text-2xl font-bold text-purple-600">
        BoilerClasses
      </div>
      <div className="space-x-4">
        <Link href="/" className="text-gray-700 hover:text-purple-600 font-medium">
          Home
        </Link>
        <Link href="/courses" className="text-gray-700 hover:text-purple-600 font-medium">
          Courses
        </Link>
        <Link href="/chat" className="text-gray-700 hover:text-purple-600 font-medium">
          Chat
        </Link>
      </div>
    </nav>
  );
}
