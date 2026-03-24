const perfilService = require('../services/perfilService');

exports.getPerfil = async (req, res) => {
    const data = await perfilService.getProfile(req.supabase, req.user.id);
    res.status(200).json(data);
}

exports.updatePerfil = async (req, res) => {
  const { tipo_usuario, ...safeFields } = req.body; 
  const data = await perfilService.updatePerfil(req.supabase, req.user.id, safeFields);
  res.status(200).json(data);
};