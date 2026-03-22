const supabaseJS = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('As variáveis de ambiente do supabase estão vazias');
  process.exit(1);
}

// supabase cliente pra operações públicas 
const supabase = supabaseJS.createClient(supabaseUrl, supabaseAnonKey);

// supabase cliente com cache e autenticação JWT de usuários  
const clientCache = new Map();
const TOKEN_TTL_MS = 60 * 60 * 1000;  

const getSupabaseClient = (token) => {
  const cached = clientCache.get(token);
  if (cached && Date.now() < cached.expiresAt) return cached.client;

  const client = supabaseJS.createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  clientCache.set(token, { client, expiresAt: Date.now() + TOKEN_TTL_MS });
  return client;
};

module.exports = { supabase, getSupabaseClient };