const express = require('express');
const router = express.Router();
const historicoController = require('../controllers/historicoController');
const authenticateUser = require('../middleware/authenticateUser');

router.use(authenticateUser);


router.get('/', historicoController.getHistorico);

module.exports = router;