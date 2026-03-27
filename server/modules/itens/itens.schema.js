const { z } = require('zod');

const ItemSchema = z.object({
  nome:           z.string().min(1, 'Nome é obrigatório').max(255),
  preco:          z.coerce.number({ invalid_type_error: 'Preço deve ser um número' })
                    .positive('Preço deve ser positivo')
                    .multipleOf(0.01, 'Máximo 2 casas decimais'),
  categoria:      z.string().max(255).nullable().optional(),
  descricao:      z.string().max(255).nullable().optional(),
  disponibilidade: z.boolean({ required_error: 'Disponibilidade é obrigatória' }),
  imagem_url:     z.url('imagem_url deve ser uma URL válida'),
});

const CreateItemSchema = ItemSchema;

const UpdateItemSchema = ItemSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Pelo menos um campo deve ser fornecido' }
);

// /:id param
const ItemIdParamSchema = z.object({
  id: z.coerce.number({ invalid_type_error: 'ID deve ser um número' }).int().positive(),
});

module.exports = { CreateItemSchema, UpdateItemSchema, ItemIdParamSchema };