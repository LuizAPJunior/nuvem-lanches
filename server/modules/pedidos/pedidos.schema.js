const { z } = require('zod');

exports.addPedidoSchema = z.object({
  taxa_entrega: z
    .number({ required_error: 'taxa_entrega é obrigatória', invalid_type_error: 'taxa_entrega deve ser um número' })
    .nonnegative('taxa_entrega não pode ser negativa'),

  metodo_pagamento: z.enum(['dinheiro', 'cartao_credito', 'cartao_debito', 'pix'], {
    required_error: 'metodo_pagamento é obrigatório',
    invalid_type_error: 'metodo_pagamento inválido',
  }),

  observacao: z
    .string()
    .max(500, 'observacao não pode exceder 500 caracteres')
    .nullable()
    .optional()
    .default(null),

  quantia_dinheiro: z
    .number({ invalid_type_error: 'quantia_dinheiro deve ser um número' })
    .positive('quantia_dinheiro deve ser positiva')
    .nullable()
    .optional()
    .default(null),
}).superRefine(({ metodo_pagamento, quantia_dinheiro }, ctx) => {
  if (metodo_pagamento === 'dinheiro' && (quantia_dinheiro === null || quantia_dinheiro === undefined)) {
    ctx.addIssue({
      code: 'custom',
      path: ['quantia_dinheiro'],
      message: 'quantia_dinheiro é obrigatória quando o método de pagamento é dinheiro',
    });
  }
});