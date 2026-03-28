const historicoService = require('./historicoService');

exports.getHistorico = async (req, res) => {
  const data = await historicoService.getHistorico(req.supabase, req.user.id);
  res.status(200).json(data);
};