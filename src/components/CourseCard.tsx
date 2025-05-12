interface CourseCardProps {
  code: string;
  title: string;
  description: string;
  rating: number;
}

export default function CourseCard({ code, title, description, rating }: CourseCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all border border-gray-200">
      <h2 className="text-xl font-semibold text-purple-700 mb-1">{code}</h2>
      <h3 className="text-lg text-gray-800 font-medium mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <p className="text-yellow-500 font-bold">⭐ {rating.toFixed(1)} / 5</p>
    </div>
  );
}
