import { z } from 'zod';

export const mealPayloadSchema = z.object({
  name: z
    .string({ required_error: 'O nome da refeição é obrigatório.' })
    .trim()
    .min(2, 'O nome da refeição deve ter pelo menos 2 caracteres.')
    .max(120, 'O nome da refeição deve ter no máximo 120 caracteres.'),
  description: z
    .string({ required_error: 'A descrição da refeição é obrigatória.' })
    .trim()
    .min(2, 'Descreva brevemente os alimentos da refeição.')
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres.'),
  consumedAt: z
    .string({ required_error: 'A data e hora da refeição são obrigatórias.' })
    .refine((val) => !Number.isNaN(Date.parse(val)), {
      message: 'Informe uma data e hora válidas.',
    })
    .transform((val) => new Date(val)),
  isOnDiet: z.boolean({
    required_error: 'Informe se a refeição está dentro ou fora da dieta.',
    invalid_type_error: 'O campo de status da dieta deve ser verdadeiro ou falso.',
  }),
});

export const listMealsQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(['all', 'on', 'off']).optional().default('all'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (use AAAA-MM-DD).')
    .optional(),
});

export const mealIdParamSchema = z.object({
  id: z.string().uuid('Identificador de refeição inválido.'),
});

export type MealPayloadInput = z.infer<typeof mealPayloadSchema>;
export type ListMealsQueryInput = z.infer<typeof listMealsQuerySchema>;
