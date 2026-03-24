const pedidosService = require('../services/pedidosService');

exports.addPedido = async(req, res) => {
    const { taxa_entrega, metodo_pagamento, quantia_dinheiro, observacao } = req.body;
    const data = await pedidosService.addPedido(req.supabase, {
        userId: req.user.id,
        taxa_entrega,
        metodo_pagamento,
        quantia_dinheiro, 
        observacao
    });
    res.status(200).json(data);  
}


exports.getPedidosItens = async (req, res) => {
  const data = await pedidosService.getPedidosItens(req.supabase, req.user.id, req.params.id);
  res.status(200).json(data);
};