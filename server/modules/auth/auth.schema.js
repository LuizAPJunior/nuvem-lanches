const { z } = require('zod');

const telefoneRegex = /^\d{10,11}$/;

exports.cadastrarSchema = z.object({
  email: z
    .email('Email inválido.'),

  password: z
    .string({ required_error: 'Senha é obrigatória.' })
    .min(8, 'A senha deve ter no mínimo 8 caracteres.')
    .regex(/[A-Z]/, 'A senha deve conter ao menos uma letra maiúscula.')
    .regex(/[0-9]/, 'A senha deve conter ao menos um número.'),

  nome: z
    .string({ required_error: 'Nome é obrigatório.' })
    .min(2, 'Nome deve ter ao menos 2 caracteres.')
    .max(120, 'Nome muito longo.'),

  telefone: z
    .string()
    .regex(telefoneRegex, 'Telefone inválido. Use o formato 85987123456')
    .optional(),

  endereco: z
    .string()
    .min(5, 'Endereço muito curto.')
    .max(300, 'Endereço muito longo.')
    .optional(),
});

exports.loginSchema = z.object({
  email: z
    .email('Email inválido.'),

  password: z
    .string({ required_error: 'Senha é obrigatória.' })
    .min(1, 'Senha é obrigatória.'),
});