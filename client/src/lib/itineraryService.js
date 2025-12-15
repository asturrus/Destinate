import { supabase } from './supabaseClient';

export const itineraryService = {
  async getAll() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(transformFromDb);
  },

  async getById(id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new Error('Itinerary not found');
      throw error;
    }
    return transformFromDb(data);
  },

  async create({ title, description, destinations }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('itineraries')
      .insert({
        user_id: user.id,
        title,
        description: description || null,
        destinations,
      })
      .select()
      .single();

    if (error) throw error;
    return transformFromDb(data);
  },

  async delete(id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('itineraries')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    return true;
  },
};

function transformFromDb(row) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    destinations: row.destinations,
    createdAt: row.created_at,
  };
}
