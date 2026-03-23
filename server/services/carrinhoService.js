exports.addItem = async (supabase, { userId, itemId, quantidade }) => {
  // verifica se o item existe
  const { data: item, error: itemError } = await supabase
    .from('itens')
    .select('id')
    .eq('id', itemId)

  if (itemError || !item.length) throw { status: 404, message: 'Item não encontrado' };

  const { data, error } = await supabase
    .from('carrinho_itens')
    .upsert(
      { perfil_id: userId, item_id: itemId, quantidade},
      { onConflict: 'perfil_id, item_id' }
    )
    .select();
    

  if (error) throw error;
  return data;
};

exports.getCart = async (supabase, userId) => {
  const { data, error } = await supabase
    .from('carrinho_itens')
    .select('*')
    .eq('perfil_id', userId)
    .select('*, itens(nome, preco)');

  if (error) throw error;
  return data ?? [];
};

exports.deleteItem = async (supabase, { userId, carrinhoId }) => {
  const { data, error } = await supabase
    .from('carrinho_itens')
    .delete()
    .eq('id', parseInt(carrinhoId))
    .eq('perfil_id', userId)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) throw { status: 404, message: 'Nenhum item foi encontrado no carrinho.' };
  return data;
};

exports.deleteAllItems = async (supabase, { userId }) => {
  console.log("I'm in deleteALLItems");
  console.log("user id: ", userId);
   
  const { data, error } = await supabase
    .from('carrinho_itens')
    .delete()
    .eq('perfil_id', userId)
    .select();
 
  if (error) throw error;
  if (!data || data.length === 0) throw { status: 404, message: 'Nenhum item foi encontrado no carrinho.' };
  return {message: 'Item removido com sucesso'};
};
