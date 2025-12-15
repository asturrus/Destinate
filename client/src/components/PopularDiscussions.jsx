import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { DiscussionCard } from "@/components/DiscussionCard";
import { DiscussionPage } from "@/components/DiscussionPage";
import { NewDiscussionForm } from "@/components/NewDiscussionForm";

export function PopularDiscussions() {
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDiscussions();
  }, []);

  const loadDiscussions = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('discussions')
      .select(`
          *,
          replies:replies(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match component format
      const transformedDiscussions = data.map(disc => ({
        id: disc.id,
        title: disc.title,
        author: disc.author,
        body: disc.body,
        replies: disc.replies[0]?.count || 0,
        date: new Date(disc.created_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        created_at: disc.created_at,
        user_id: disc.user_id
      }));

      setDiscussions(transformedDiscussions);
    } catch (error) {
      console.error('Error loading discussions:', error);
      toast({
        title: "Error",
        description: "Failed to load discussions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addDiscussion = async (newDiscussion) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Insert into Supabase
      const { data, error } = await supabase
        .from('discussions')
        .insert([
          {
            title: newDiscussion.title,
            author: newDiscussion.author,
            body: newDiscussion.body || '',
            user_id: user?.id || null
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const transformedDiscussion = {
        id: data.id,
        title: data.title,
        author: data.author,
        body: data.body,
        replies: 0,
        date: new Date(data.created_at).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        created_at: data.created_at,
        user_id: data.user_id
      };

      setDiscussions([transformedDiscussion, ...discussions]);
      setShowForm(false);
      
      toast({
        title: "Success",
        description: "Discussion posted successfully!"
      });
    } catch (error) {
      console.error('Error adding discussion:', error);
      toast({
        title: "Error",
        description: "Failed to post discussion",
        variant: "destructive"
      });
    }
  };

  if (selected) {
    return (
      <DiscussionPage 
        discussion={selected} 
        onBack={() => {
          setSelected(null);
          loadDiscussions(); // Reload to get updated reply count
        }}
      />
    );
  }

  return (
    <section className="py-12 px-6" data-testid="section-popular-discussions">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center" data-testid="text-discussions-heading">
          Popular Discussions
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-500 transition"
          data-testid="button-new-post"
        >
          {showForm ? "Cancel" : "+ New Post"}
        </button>
      </div>

      {showForm && <NewDiscussionForm onAddDiscussion={addDiscussion} />}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading discussions...</p>
        </div>
      ) : discussions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No discussions yet. Be the first to post!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" data-testid="grid-discussions">
          {discussions.map((disc) => (
            <DiscussionCard
              key={disc.id}
              discussion={disc}
              onClick={() => setSelected(disc)}
            />
          ))}
        </div>
      )}
    </section>
  );
}