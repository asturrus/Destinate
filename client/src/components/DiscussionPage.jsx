import { useState } from "react";

export function DiscussionPage({ discussion, onBack }) {
  // Prevent crashes if discussion isn't passed correctly
  if (!discussion) {
    return (
      <div className="p-6 text-red-500">
        Error: Discussion data not found.
      </div>
    );
  }

  // Make replies always an array
  const initialReplies = Array.isArray(discussion.replies)
    ? discussion.replies
    : [];

  const [replies, setReplies] = useState(initialReplies);
  const [newReply, setNewReply] = useState("");

  const handleAddReply = () => {
    if (!newReply.trim()) return;

    const reply = {
      id: Date.now(),
      author: "Current User",
      date: new Date().toLocaleDateString(),
      text: newReply,
    };

    setReplies((prev) => [...prev, reply]);
    setNewReply("");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto" data-testid="page-discussion-detail">

      <button
        onClick={onBack}
        className="mb-4 text-blue-500 hover:underline"
        data-testid="button-back-to-discussions"
      >
        Back
      </button>

      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white"
          data-testid="text-discussion-detail-title">
        {discussion.title}
      </h1>

      <p className="text-gray-600 dark:text-gray-300"
         data-testid="text-discussion-detail-author">
        {discussion.author}
      </p>

      <p className="text-gray-500 dark:text-gray-400 mb-6"
         data-testid="text-discussion-detail-date">
        {discussion.date}
      </p>

      <div
        className="
          p-4 rounded shadow mb-8
          bg-white text-gray-900
          dark:bg-gray-800 dark:text-gray-100
        "
      >
        <p>{discussion.body || "No content provided."}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Replies
      </h2>

      {replies.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          No replies yet. Be the first to comment!
        </p>
      )}

      <div className="space-y-4 mb-8">
        {replies.map((reply) => (
          <div
            key={reply.id}
            className="
              p-4 rounded shadow
              bg-white text-gray-900
              dark:bg-gray-800 dark:text-gray-100
            "
          >
            <p className="font-semibold">{reply.author}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {reply.date}
            </p>
            <p className="mt-2">{reply.text}</p>
          </div>
        ))}
      </div>

      <div
        className="
          p-4 rounded shadow
          bg-white text-gray-900
          dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700
        "
      >
        <textarea
          className="
            w-full p-3 border rounded mb-3 resize-none
            bg-white text-gray-900
            dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700
          "
          rows={3}
          placeholder="Write a reply…"
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
        />

        <button
          onClick={handleAddReply}
          className="
            bg-blue-600 text-white px-4 py-2 rounded
            hover:bg-blue-700 transition
          "
        >
          Post Reply
        </button>
      </div>
    </div>
  );
}