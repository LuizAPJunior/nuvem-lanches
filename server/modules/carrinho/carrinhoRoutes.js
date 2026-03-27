const express = require('express');
const router = express.Router();
const carrinhoController = require('./carrinhoController');
const authenticateUser = require('../../middleware/authenticateUser');
const validate = require('../../middleware/validate');
const {
  addItemSchema,
  updateQuantitySchema,
  carrinhoParamSchema,
} = require('./carrinho.schema');

router.use(authenticateUser);

router.get('/', carrinhoController.getCart);

router.post(
  '/',
  validate(addItemSchema, 'body'),
  carrinhoController.addItem
);

router.patch(
  '/:id',
  validate(carrinhoParamSchema, 'params'),
  validate(updateQuantitySchema, 'body'),
  carrinhoController.updateQuantity
);

router.delete(
  '/:id',
  validate(carrinhoParamSchema, 'params'),
  carrinhoController.deleteItem
);

router.delete('/', carrinhoController.deleteAllItems);

module.exports = router;