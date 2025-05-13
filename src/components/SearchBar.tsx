export default function SearchBar({ query, setQuery }: { query: string; setQuery: (value: string) => void }) {
  return (
    <div className="mb-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search courses..."
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </div>
  );
}
