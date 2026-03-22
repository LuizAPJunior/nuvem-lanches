const { supabase } = require('../supabase');

exports.getAllItens = async () => {
  const { data, error } = await supabase.from('itens').select('*');
  if (error) throw error;
  return data;
};

exports.deleteItem = async (itemId) => {
  const { data, error } = await supabase.from('itens').delete().eq('id', itemId);
  if (error) throw error;
  return data;
};