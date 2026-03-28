const express = require('express');
const router = express.Router();
const perfilController = require('./perfilController');
const authenticateUser = require('../../middleware/authenticateUser');
const validate = require('../../middleware/validate');
const { updatePerfilSchema } = require('./perfil.schema');

router.use(authenticateUser);

router.get('/', perfilController.getPerfil);
router.patch('/', validate(updatePerfilSchema), perfilController.updatePerfil);

module.exports = router;