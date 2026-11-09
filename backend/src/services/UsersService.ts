import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../errors/AppError';
import { prisma } from '../lib/prisma';
import { RegisterUserInput, UpdateProfileInput } from '../schemas/userSchemas';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  dietGoal: number;
  createdAt: Date;
}

export function generateAuthToken(userId: string): string {
  return jwt.sign({}, env.JWT_SECRET, {
    subject: userId,
    expiresIn: '7d',
  });
}

export class UsersService {
  async register(data: RegisterUserInput): Promise<{ user: PublicUser; token: string }> {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Já existe uma conta cadastrada com este e-mail.', 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        dietGoal: data.dietGoal ?? 80,
      },
      select: {
        id: true,
        name: true,
        email: true,
        dietGoal: true,
        createdAt: true,
      },
    });

    const token = generateAuthToken(user.id);

    return { user, token };
  }

  async getProfile(userId: string): Promise<PublicUser> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        dietGoal: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    return user;
  }

  async updateProfile(userId: string, data: UpdateProfileInput): Promise<PublicUser> {
    const existing = await prisma.user.findUnique({ where: { id: userId } });

    if (!existing) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.dietGoal !== undefined ? { dietGoal: data.dietGoal } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        dietGoal: true,
        createdAt: true,
      },
    });

    return updated;
  }
}
