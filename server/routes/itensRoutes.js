const express = require('express');
const router = express.Router();
const itensController = require('../controllers/itensController');
const authenticateUser = require('../middleware/authenticateUser');


router.get('/', itensController.getAllItens);
router.post('/', authenticateUser ,itensController.addItem);
router.put('/:id', authenticateUser ,itensController.updateItem);
router.delete('/:id', authenticateUser, itensController.deleteItem);

module.exports = router;