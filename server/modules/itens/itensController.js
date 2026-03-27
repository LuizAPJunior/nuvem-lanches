const itensService = require('./itensService');

exports.getAllItens = async (req, res) => {
  const data = await itensService.getAllItens();
  res.json(data);
};

exports.addItem = async (req, res) => {
  const userToken = req.headers.authorization?.split(' ')[1];

  // ✅ req.body is already validated by middleware — pass it directly
  const data = await itensService.addItem(req.body, userToken);
  res.status(201).json(data);
};

exports.updateItem = async (req, res) => {  // ✅ Added catchAsync
  const userToken = req.headers.authorization?.split(' ')[1];

  // ✅ req.params.id is coerced to a number by Zod
  const data = await itensService.updateItem(req.params.id, req.body, userToken);
  res.json(data);
};

exports.deleteItem = async (req, res) => {
  const userToken = req.headers.authorization?.split(' ')[1];
  await itensService.deleteItem(req.params.id, userToken);
  res.sendStatus(204);
};