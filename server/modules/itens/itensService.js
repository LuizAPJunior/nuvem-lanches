const supabaseJS = require('@supabase/supabase-js');
const { supabase } = require('../../supabase');

// supabase client
const createAuthClient = (userToken) =>
  supabaseJS.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: { Authorization: `Bearer ${userToken}` },
      },
    }
  );

exports.getAllItens = async () => {
  const { data, error } = await supabase.from('itens').select('*');
  if (error) throw error;
  return data;
};


exports.addItem = async (dto, userToken) => {
  const supabaseClient = createAuthClient(userToken);

  const { data, error } = await supabaseClient
    .from('itens')
    .insert(dto)
    .select();

  if (error) throw error;
  return data;
};


exports.updateItem = async (itemId, dto, userToken) => {
  const supabaseClient = createAuthClient(userToken);

  const { data, error } = await supabaseClient
    .from('itens')
    .update(dto)
    .eq('id', itemId)
    .select();

  if (error) throw error;
  return data;
};

exports.deleteItem = async (itemId, userToken) => {
  const supabaseClient = createAuthClient(userToken);

  const { data, error } = await supabaseClient
    .from('itens')
    .delete()
    .eq('id', itemId);

  if (error) throw error;
  return data;
};