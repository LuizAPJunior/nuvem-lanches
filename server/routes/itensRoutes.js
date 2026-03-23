const express = require('express');
const router = express.Router();
const itensController = require('../controllers/itensController');
const authenticateUser = require('../middleware/authenticateUser');


router.get('/', itensController.getAllItens);
router.post('/', authenticateUser ,itensController.addItem);
router.delete('/:id', authenticateUser, itensController.deleteItem); // test route

module.exports = router;