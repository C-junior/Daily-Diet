import { z } from 'zod';

export const registerUserSchema = z.object({
  name: z
    .string({ required_error: 'O nome é obrigatório.' })
    .trim()
    .min(2, 'O nome deve ter pelo menos 2 caracteres.')
    .max(80, 'O nome deve ter no máximo 80 caracteres.'),
  email: z
    .string({ required_error: 'O e-mail é obrigatório.' })
    .trim()
    .email('Informe um endereço de e-mail válido.')
    .transform((v) => v.toLowerCase()),
  password: z
    .string({ required_error: 'A senha é obrigatória.' })
    .min(6, 'A senha deve ter pelo menos 6 caracteres.')
    .max(100, 'A senha é muito longa.'),
  dietGoal: z.coerce
    .number()
    .int()
    .min(10, 'A meta deve ser entre 10% e 100%.')
    .max(100, 'A meta deve ser entre 10% e 100%.')
    .optional()
    .default(80),
});

export const loginSessionSchema = z.object({
  email: z
    .string({ required_error: 'O e-mail é obrigatório.' })
    .trim()
    .email('Informe um endereço de e-mail válido.')
    .transform((v) => v.toLowerCase()),
  password: z
    .string({ required_error: 'A senha é obrigatória.' })
    .min(1, 'Informe sua senha.'),
});

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'O nome deve ter pelo menos 2 caracteres.')
    .max(80, 'O nome deve ter no máximo 80 caracteres.')
    .optional(),
  dietGoal: z.coerce
    .number()
    .int()
    .min(10, 'A meta deve ser entre 10% e 100%.')
    .max(100, 'A meta deve ser entre 10% e 100%.')
    .optional(),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginSessionInput = z.infer<typeof loginSessionSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
