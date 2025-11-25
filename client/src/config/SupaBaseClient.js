import { createClient } from '@supabase/supabase-js';

console.log('Supabase URL:', "Working URL");
console.log('Supabase Anon Key:', "Working Key");

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,     // Enable for old SignIn to work
    persistSession: true,       // Enable session persistence for old SignIn
    detectSessionInUrl: false,  // Keep disabled to avoid URL conflicts
    flowType: 'pkce'           // Use more secure flow type
  }
});

export default supabase;