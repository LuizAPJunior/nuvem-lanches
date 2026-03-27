const supabaseJS = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('As variáveis de ambiente do supabase estão vazias');
  process.exit(1);
}

// supabase cliente pra operações públicas 
const supabase = supabaseJS.createClient(supabaseUrl, supabaseAnonKey);

const clientCache = new Map();

// supabase cliente com cache e autenticação JWT de usuários  
const getSupabaseClient = (token) => {
  const cached = clientCache.get(token);
  if (cached && Date.now() < cached.expiresAt) return cached.client;

  const { exp } = require('jsonwebtoken').decode(token);
  const expiresAt = exp * 1000; 

  const client = supabaseJS.createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  clientCache.set(token, { client, expiresAt });
  return client;
};

setInterval(() => {
  const now = Date.now();
  for (const [token, { expiresAt }] of clientCache.entries()) {
    if (now >= expiresAt) clientCache.delete(token);
  }
}, 5 * 60 * 1000); 


const removeClientFromCache = (token) => clientCache.delete(token);

module.exports = { supabase, getSupabaseClient, removeClientFromCache };