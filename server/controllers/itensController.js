const itensService = require('../services/itensService');
const catchAsync = require('../utils/catchAsync');

exports.getAllItens = catchAsync(async (req, res) => {
  const data = await itensService.getAllItens();
  res.json(data);
});

exports.deleteItem = catchAsync(async (req, res) => {
  const data = await itensService.deleteItem(req.params.id);
  res.json(data);
});