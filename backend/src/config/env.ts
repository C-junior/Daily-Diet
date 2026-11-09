import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().default('file:./dev.db'),
  JWT_SECRET: z.string().min(8).default('daily-diet-super-secret-jwt-key-2026'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
});

// Garante que o Prisma encontre DATABASE_URL mesmo se o usuário clonar o repo sem copiar o .env
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

export const env = envSchema.parse(process.env);
