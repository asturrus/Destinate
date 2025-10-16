// client/src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

//project URL and anon/public API key

const supabaseUrl = 'https://yalzwjzfumdjjsjhxgim.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhbHp3anpmdW1kampzamh4Z2ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NDcyMTgsImV4cCI6MjA3NjAyMzIxOH0.n3o1-HPm-Qwy2iEHLFe9m6SQjtXK2wxqcuyWTdDmvrA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);