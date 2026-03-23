const carrinhoService = require('../services/carrinhoService');
const catchAsync = require('../utils/catchAsync');

exports.addItem = catchAsync(async (req, res) => {
  const { itemId, quantidade } = req.body;
  const data = await carrinhoService.addItem(req.supabase, {
    userId: req.user.id,
    itemId,
    quantidade,
  });
  console.log(data);
  
  res.status(201).json(data);
});

exports.getCart = catchAsync(async (req, res) => {
  const data = await carrinhoService.getCart(req.supabase, req.user.id);
  res.status(200).json(data);
});

exports.deleteItem = catchAsync(async (req, res) => {
  await carrinhoService.deleteItem(req.supabase, {
    userId: req.user.id,
    carrinhoId: req.params.id,
  });
  res.status(204).send();
});

exports.deleteAllItems = catchAsync(async (req, res) => {
  console.log('controller: ', req.user.id);  
  await carrinhoService.deleteAllItems(req.supabase, {
    userId: req.user.id
  });
  res.status(204).send();
});