import { useState } from "react";

export function NewDiscussionForm({ onAddDiscussion }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const newDiscussion = {
      title: title.trim(),
      body: body.trim(),
    };

    onAddDiscussion(newDiscussion);

    setTitle("");
    setBody("");
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="max-w-md mx-auto mb-8 p-4 bg-white dark:bg-gray-800 shadow rounded-xl" 
      data-testid="form-new-discussion"
    >
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
        Start a New Discussion
      </h3>
      
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Discussion title"
        className="w-full px-4 py-2 mb-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
        data-testid="input-discussion-title"
        required
      />
      
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What would you like to discuss? (optional)"
        className="w-full px-4 py-2 mb-2 border rounded resize-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
        rows={4}
        data-testid="input-discussion-body"
      />
      
      <button
        type="submit"
        className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition"
        data-testid="button-post-discussion"
      >
        Post Discussion
      </button>
    </form>
  );
}