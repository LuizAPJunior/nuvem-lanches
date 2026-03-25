exports.addPedido = async (supabase, {userId, taxa_entrega, metodo_pagamento, observacao=null ,quantia_dinheiro=null}) => {
    const { data, error } = await supabase
    .rpc('finalizar_pedido', { 
        p_user_id: userId,
        p_taxa_entrega: taxa_entrega,
        p_metodo_pagamento: metodo_pagamento, 
        p_quantia_dinheiro: quantia_dinheiro,      
        p_observacao: observacao   
    })
    .select();

    if (error) throw error;
    return data;
}


exports.getPedidosItens = async(supabase, userId, pedidoId) => {
    const { data, error } = await supabase
    .from('pedidos')
    .select(`
        *,
        pedido_items (*)
    `)
    .eq('id', pedidoId)
    .eq('perfil_id', userId)  
    .select()

    if (error) throw error;
    return data;
}