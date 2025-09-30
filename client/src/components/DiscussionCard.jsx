export function DiscussionCard({ title, author, replies, date }) {
    return (
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-1">Posted by {author}</p>
        <p className="text-sm text-gray-500">{replies} replies • {date}</p>
      </div>
    );
  }