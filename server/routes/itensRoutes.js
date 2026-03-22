const express = require('express');
const router = express.Router();
const itensController = require('../controllers/itensController');

router.get('/', itensController.getAllItens);
router.delete('/:id', itensController.deleteItem); // test route

module.exports = router;