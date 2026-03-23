const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/carrinhoController');
const authenticateUser = require('../middleware/authenticateUser');

router.use(authenticateUser); // all carrinho routes require auth

router.get('/', carrinhoController.getCart);
router.post('/', carrinhoController.addItem);
router.delete('/:id', carrinhoController.deleteItem);
router.delete('/', carrinhoController.deleteAllItems);

module.exports = router;