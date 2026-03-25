const pedidosService = require('./pedidosService');
const catchAsync = require('../../utils/catchAsync');

exports.addPedido = catchAsync(async (req, res) => {
  const { taxa_entrega, metodo_pagamento, observacao, quantia_dinheiro } = req.body;
  const data = await pedidosService.addPedido(req.supabase, {
    userId: req.user.id,
    taxa_entrega,
    metodo_pagamento,
    observacao,
    quantia_dinheiro,
  });
  res.status(201).json(data);
});

exports.getPedidosItens = catchAsync(async (req, res) => {
  const data = await pedidosService.getPedidosItens(req.supabase, req.user.id, req.params.id);
  res.status(200).json(data);
});