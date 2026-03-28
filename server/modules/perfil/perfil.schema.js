const { z } = require('zod');

const telefoneRegex = /^\d{10,11}$/;

const TipoUsuario = z.enum(['cliente', 'administrador']);

const perfilSchema = z.object({
  nome: z.string().min(2).max(100),
  telefone: z.string().regex(telefoneRegex, 'Telefone inválido. Use o formato 85987123456'),
  endereco: z.string().min(5).max(300),
  email: z.email('E-mail inválido'),
  tipo_usuario: TipoUsuario,
});

// tipo_usuario não pode ser atualizado
exports.updatePerfilSchema = perfilSchema
  .omit({ tipo_usuario: true })
  .partial()
  .strict();