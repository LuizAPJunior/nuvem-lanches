import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Supabase stores session in localStorage by default and auto-refreshes tokens.
    // This is safe as long as you sanitize all rendered content (no dangerouslySetInnerHTML
    // with user data). For higher security, configure your backend to use httpOnly cookies.
    persistSession: true,
    autoRefreshToken: true,  
    detectSessionInUrl: true,
  },
});