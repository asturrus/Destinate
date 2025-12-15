import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

export function DiscussionPage({ discussion, onBack }) {
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  if (!discussion) {
    return (
      <div className="p-6 text-red-500">
        Error: Discussion data not found.
      </div>
    );
  }

  useEffect(() => {
    loadReplies();
  }, [discussion.id]);

  const loadReplies = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('replies')
        .select('*')
        .eq('discussion_id', discussion.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Transform replies to match component format
      const transformedReplies = data.map(reply => ({
        id: reply.id,
        author: reply.author,
        date: new Date(reply.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        text: reply.text,
        user_id: reply.user_id
      }));

      setReplies(transformedReplies);
    } catch (error) {
      console.error('Error loading replies:', error);
      toast({
        title: "Error",
        description: "Failed to load replies",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async () => {
    if (!newReply.trim()) return;

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Insert reply into Supabase
      const { data, error } = await supabase
        .from('replies')
        .insert([
          {
            discussion_id: discussion.id,
            author: user?.email?.split('@')[0] || "Anonymous", // Use email username or "Anonymous"
            text: newReply.trim(),
            user_id: user?.id || null
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const transformedReply = {
        id: data.id,
        author: data.author,
        date: new Date(data.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        text: data.text,
        user_id: data.user_id
      };

      setReplies([...replies, transformedReply]);
      setNewReply("");
      
      toast({
        title: "Success",
        description: "Reply posted successfully!"
      });
    } catch (error) {
      console.error('Error adding reply:', error);
      toast({
        title: "Error",
        description: "Failed to post reply",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto" data-testid="page-discussion-detail">
      <button
        onClick={onBack}
        className="mb-4 text-blue-500 hover:underline"
        data-testid="button-back-to-discussions"
      >
        ← Back to Discussions
      </button>

      <h1 
        className="text-3xl font-bold mb-2 text-gray-900 dark:text-white"
        data-testid="text-discussion-detail-title"
      >
        {discussion.title}
      </h1>

      <p 
        className="text-gray-600 dark:text-gray-300"
        data-testid="text-discussion-detail-author"
      >
        Posted by {discussion.author}
      </p>

      <p 
        className="text-gray-500 dark:text-gray-400 mb-6"
        data-testid="text-discussion-detail-date"
      >
        {discussion.date}
      </p>

      {discussion.body && (
        <div className="p-4 rounded shadow mb-8 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
          <p>{discussion.body}</p>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Replies ({replies.length})
      </h2>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Loading replies...
        </p>
      ) : replies.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          No replies yet. Be the first to comment!
        </p>
      ) : null}

      <div className="space-y-4 mb-8">
        {replies.map((reply) => (
          <div
            key={reply.id}
            className="p-4 rounded shadow bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          >
            <p className="font-semibold">{reply.author}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {reply.date}
            </p>
            <p className="mt-2">{reply.text}</p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded shadow bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 dark:border dark:border-gray-700">
        <textarea
          className="w-full p-3 border rounded mb-3 resize-none bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
          rows={3}
          placeholder="Write a reply…"
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
        />

        <button
          onClick={handleAddReply}
          disabled={!newReply.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Post Reply
        </button>
      </div>
    </div>
  );
}