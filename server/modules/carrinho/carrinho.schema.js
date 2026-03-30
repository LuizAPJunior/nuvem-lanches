const { z } = require('zod');

// Shared param schema — used for routes with /:id
exports.carrinhoParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'O id deve ser um número inteiro positivo')
    .transform(Number),
});

// POST / — add item to cart
exports.addItemSchema = z.object({
  itemId: z
    .number({ required_error: 'itemId é obrigatório', invalid_type_error: 'itemId deve ser um número' })
    .int('itemId deve ser um número inteiro')
    .positive('itemId deve ser positivo'),
});

// PATCH /:id — update quantity
exports.updateQuantitySchema = z.object({
  quantidade: z.number({
    required_error: 'quantidade é obrigatório',
    invalid_type_error: 'quantidade deve ser um número inteiro',
  }).int('quantidade deve ser um número inteiro')
    .positive('quantidade deve ser positivo'),
});