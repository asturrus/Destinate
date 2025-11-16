export function DiscussionCard({ discussion, onClick }) {
    return (
      // <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4">
      //   <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      //   <p className="text-sm text-gray-600 mb-1">Posted by {author}</p>
      //   <p className="text-sm text-gray-500">{replies} replies • {date}</p>
      // </div>
      <div
        onClick={onClick}
        className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 cursor-pointer"
        data-testid="card-discussion"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-2" data-testid="text-discussion-title">
          { discussion.title }
        </h3>
        <p className="text-sm text-gray-600 mb-1" data-testid="text-discussion-author">
          Posted by {discussion.author}
        </p>
        <p className="text-sm text-gray-500" data-testid="text-discussion-stats">
          {discussion.replies} replies - {discussion.date}
        </p>
      </div>
    );
  }