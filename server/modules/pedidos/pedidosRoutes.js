const express = require('express');
const router = express.Router();
const pedidosController = require('./pedidosController');
const authenticateUser = require('../../middleware/authenticateUser');
const validate = require('../../middleware/validate');
const { addPedidoSchema } = require('./pedidos.schema');

router.use(authenticateUser);

router.get('/:id', pedidosController.getPedidosItens);
router.post('/', validate(addPedidoSchema), pedidosController.addPedido);

module.exports = router;