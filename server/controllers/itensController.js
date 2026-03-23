const itensService = require('../services/itensService');
const catchAsync = require('../utils/catchAsync');

exports.getAllItens = catchAsync(async (req, res) => {
  const data = await itensService.getAllItens();
  res.json(data);
});

exports.addItem = catchAsync(async (req, res) => {
  const userToken = req.headers.authorization?.split(' ')[1];
  const { nome, preco, categoria, descricao, disponibilidade, imagem_url } = req.body;
  const data = await itensService.addItem(nome, preco, categoria, descricao, disponibilidade, imagem_url, userToken);
  res.json(data);
});

exports.updateItem = async(req, res) => {
  const userToken = req.headers.authorization?.split(' ')[1];
  const itemId = req.params.id;
  const { nome, preco, categoria, descricao, disponibilidade, imagem_url } = req.body;
  const data = await itensService.updateItem(itemId, nome, preco, categoria, descricao, disponibilidade, imagem_url, userToken);
  res.json(data);
}

exports.deleteItem = catchAsync(async (req, res) => {
  const userToken = req.headers.authorization?.split(' ')[1];
  const data = await itensService.deleteItem(req.params.id, userToken);
  res.sendStatus(204);
});