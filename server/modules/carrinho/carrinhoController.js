const carrinhoService = require('./carrinhoService');
const catchAsync = require('../../utils/catchAsync');

exports.addItem = catchAsync(async (req, res) => {
  const { itemId } = req.body;
  const data = await carrinhoService.addItem(req.supabase, {
    userId: req.user.id,
    itemId,
  });
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
  await carrinhoService.deleteAllItems(req.supabase, {
    userId: req.user.id,
  });
  res.status(204).send();
});

exports.updateQuantity = catchAsync(async (req, res) => {
  const data = await carrinhoService.updateQuantity(req.supabase, {
    userId: req.user.id,
    carrinhoId: req.params.id,
    action: req.body.action,
  });
  res.status(200).json(data);
});