import { useState } from "react";

export function NewDiscussionForm({ onAddDiscussion }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const newDiscussion = {
      title,
      author,
      replies: 0,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };

    onAddDiscussion(newDiscussion);
    setTitle("");
    setAuthor("");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-8 p-4 bg-white shadow rounded-xl">
      <h3 className="text-lg font-bold mb-4">Start a New Discussion</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Discussion title"
        className="w-full px-4 py-2 mb-2 border rounded"
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Your name"
        className="w-full px-4 py-2 mb-2 border rounded"
      />
      <button
        type="submit"
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
      >
        Post Discussion
      </button>
    </form>
  );
}