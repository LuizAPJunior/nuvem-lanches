const supabaseJS = require('@supabase/supabase-js');

const { supabase } = require('../supabase');

exports.getAllItens = async () => {
  const { data, error } = await supabase.from('itens').select('*');
  if (error) throw error;
  return data;
};

exports.addItem = async (nome, preco, categoria, descricao, disponibilidade, imagem_url, userToken) => {

  const supabaseClient = supabaseJS.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: { Authorization: `Bearer ${userToken}` },
      },
    }
  );

  const description = descricao? descricao : null 
  const { data, error } = await supabaseClient
  .from('itens')
  .insert({nome, preco, categoria, descricao: description, disponibilidade, imagem_url })
  .select();
  if (error) throw error;
  return data;
};


exports.updateItem = async (itemId, nome, preco, categoria, descricao, disponibilidade, imagem_url, userToken ) => {
  
  const supabaseClient = supabaseJS.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: { Authorization: `Bearer ${userToken}` },
      },
    }
  );

  const { data, error } = await supabaseClient
  .from('itens')
  .update({nome, preco, categoria, descricao, disponibilidade, imagem_url})
  .eq('id', itemId)
  .select();
  if (error) throw error;
  return data;

}

exports.deleteItem = async (itemId, userToken) => {

  const supabaseClient = supabaseJS.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: { Authorization: `Bearer ${userToken}` },
      },
    }
  );

  const { data, error } = await supabaseClient.from('itens').delete().eq('id', itemId);
  if (error) throw error;
  return data;
};

