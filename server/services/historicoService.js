exports.getHistorico = async(supabase, userId) => {
    const { data: pedidos, error: pedidosError } = await supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false });

  if (pedidosError) return res.status(500).json({ error: pedidosError.message });

  const pedidoIds = pedidos.map(p => p.id);

  const { data: itens, error: itensError } = await supabase
    .from('pedido_itens')
    .select('*')
    .in('pedido_id', pedidoIds);

  if (itensError) return res.status(500).json({ error: itensError.message });

  // Merge itens into their respective pedidos
  const result = pedidos.map(pedido => ({
    ...pedido,
    pedido_itens: itens.filter(item => item.pedido_id === pedido.id)
  }));
  return result;
}