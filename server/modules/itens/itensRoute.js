const express = require('express');
const router = express.Router();
const itensController = require('./itensController');
const authenticateUser = require('../../middleware/authenticateUser');
const validate = require('../../middleware/validate');
const {
  CreateItemSchema,
  UpdateItemSchema,
  ItemIdParamSchema,
} = require('./itens.schema');

router.get(
  '/',
  itensController.getAllItens
);

router.post(
  '/',
  authenticateUser,
  validate(CreateItemSchema, 'body'),    // ✅ validates body
  itensController.addItem
);

router.patch(
  '/:id',
  authenticateUser,
  validate(ItemIdParamSchema, 'params'), // ✅ validates :id
  validate(UpdateItemSchema, 'body'),    // ✅ validates body
  itensController.updateItem
);

router.delete(
  '/:id',
  authenticateUser,
  validate(ItemIdParamSchema, 'params'), // ✅ validates :id
  itensController.deleteItem
);

module.exports = router;