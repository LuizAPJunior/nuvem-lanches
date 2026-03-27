const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');
const authenticateUser = require('../middleware/authenticateUser');

router.use(authenticateUser);

router.get('/', perfilController.getPerfil);
router.patch('/', perfilController.updatePerfil);


module.exports = router;