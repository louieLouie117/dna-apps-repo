import { createClient } from '@supabase/supabase-js';

console.log('Supabase URL:', "Working URL");
console.log('Supabase Anon Key:', "Working Key");

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
    flowType: 'implicit'
  }
});

export default supabase;