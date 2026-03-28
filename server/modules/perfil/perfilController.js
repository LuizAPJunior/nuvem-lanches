
const perfilService = require('./perfilService');

exports.getPerfil = async (req, res) => {
  const data = await perfilService.getProfile(req.supabase, req.user.id);
  res.status(200).json(data);
};

exports.updatePerfil = async (req, res) => {
  const data = await perfilService.updatePerfil(req.supabase, req.user.id, req.body);
  res.status(200).json(data);
};