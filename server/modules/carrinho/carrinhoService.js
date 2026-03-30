// adiciona um item no carrinho por exemplo: adiciona uma pizza no carrinho
exports.addItem = async (supabase, { userId, itemId }) => {
  // verifica se o item existe
  const { data: item, error: itemError } = await supabase
    .from('itens')
    .select('id')
    .eq('id', itemId)

  if (itemError || !item.length) throw { status: 404, message: 'Item não encontrado' };

  const { data, error } = await supabase
    .from('carrinho_itens')
    .upsert(
      { perfil_id: userId, item_id: itemId, quantidade: 1},
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
    .eq('id', carrinhoId)
    .eq('perfil_id', userId)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) throw { status: 404, message: 'Nenhum item foi encontrado no carrinho.' };
  return data;
};

// limpar o carrinho
exports.deleteAllItems = async (supabase, { userId }) => {
  const { data, error } = await supabase
    .from('carrinho_itens')
    .delete()
    .eq('perfil_id', userId)
    .select();
 
  if (error) throw error;
  if (!data || data.length === 0) throw { status: 404, message: 'Nenhum item foi encontrado no carrinho.' };
  return {message: 'Item removido com sucesso'};
};

//carrinhoId é o id  da "linha" do carrinho, não é id do item
exports.updateQuantity = async (supabase, {userId, carrinhoId, quantidade}) => {

  //selecionar a quantidade do item   
  const { data, error } = await supabase
  .from('carrinho_itens')
  .select('quantidade')
  .eq('id', carrinhoId)
  .eq('perfil_id', userId)
  .select();

  if (error) throw error;
  if (!data || data.length === 0) throw { status: 404, message: 'Nenhum item foi encontrado no carrinho.' };
  
  // let quantidadeAtualizada = 0;
  // if (action === 'adicionar') quantidadeAtualizada = data[0].quantidade + 1;  
  // else if (action === 'subtrair') quantidadeAtualizada = data[0].quantidade - 1;  

  //atualizar o valor do item
  const { data: quantityUpdated, error: quantityError } = await supabase
  .from('carrinho_itens') 
  .update({quantidade})
  .eq('id', carrinhoId)
  .eq('perfil_id', userId)
  .select();
 
  if (quantityError) throw quantityError;

  return quantityUpdated;   
}
