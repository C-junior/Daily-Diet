import bcrypt from 'bcryptjs';
import { AppError } from '../errors/AppError';
import { prisma } from '../lib/prisma';
import { LoginSessionInput } from '../schemas/userSchemas';
import { generateAuthToken, PublicUser } from './UsersService';

export class SessionsService {
  async authenticate(data: LoginSessionInput): Promise<{ user: PublicUser; token: string }> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError('E-mail ou senha incorretos.', 401);
    }

    const passwordMatches = await bcrypt.compare(data.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError('E-mail ou senha incorretos.', 401);
    }

    const token = generateAuthToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        dietGoal: user.dietGoal,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async authenticateDemo(): Promise<{ user: PublicUser; token: string }> {
    const demoEmail = 'demo@dailydiet.app';
    let user = await prisma.user.findUnique({ where: { email: demoEmail } });

    if (!user) {
      const passwordHash = await bcrypt.hash('demo123', 10);
      user = await prisma.user.create({
        data: {
          name: 'Marina Costa',
          email: demoEmail,
          passwordHash,
          dietGoal: 80,
        },
      });
    }

    const existingCount = await prisma.meal.count({ where: { userId: user.id } });

    if (existingCount === 0) {
      const now = new Date();
      const buildDate = (daysAgo: number, hours: number, minutes: number) => {
        const d = new Date(now);
        d.setDate(d.getDate() - daysAgo);
        d.setHours(hours, minutes, 0, 0);
        return d;
      };

      await prisma.meal.createMany({
        data: [
          {
            userId: user.id,
            name: 'Omelete com aveia e frutas',
            description: '2 ovos caipiras mexidos com espinafre, 1 fatia de mamão com chia e café sem açúcar.',
            consumedAt: buildDate(3, 7, 45),
            isOnDiet: true,
          },
          {
            userId: user.id,
            name: 'Almoço executivo fit',
            description: 'Filé de frango grelhado (150g), arroz integral, feijão carioca e salada verde com azeite.',
            consumedAt: buildDate(3, 12, 30),
            isOnDiet: true,
          },
          {
            userId: user.id,
            name: 'Hambúrguer artesanal com batata',
            description: 'Jantar com amigos: burger duplo no pão brioche e porção pequena de batata rústica.',
            consumedAt: buildDate(2, 20, 15),
            isOnDiet: false,
          },
          {
            userId: user.id,
            name: 'Iogurte natural com whey e morangos',
            description: '170g de iogurte natural desnatado, 1 scoop de whey de baunilha, morangos picados e granola sem açúcar.',
            consumedAt: buildDate(1, 8, 10),
            isOnDiet: true,
          },
          {
            userId: user.id,
            name: 'Tilápia assada com purê de mandioquinha',
            description: 'Filé de tilápia com ervas finas, purê leve de mandioquinha e brócolis no vapor.',
            consumedAt: buildDate(1, 12, 45),
            isOnDiet: true,
          },
          {
            userId: user.id,
            name: 'Sanduíche integral de atum',
            description: 'Pão 100% integral com pasta de atum em água, ricota temperada, cenoura ralada e alface.',
            consumedAt: buildDate(1, 16, 30),
            isOnDiet: true,
          },
          {
            userId: user.id,
            name: 'Crepioca recheada com queijo minas',
            description: '1 ovo + 2 colheres de goma de tapioca, recheada com queijo minas frescal grelhado e orégano.',
            consumedAt: buildDate(0, 8, 0),
            isOnDiet: true,
          },
          {
            userId: user.id,
            name: 'Bowl de patinho moído e abóbora cabotiá',
            description: '140g de patinho refogado, cubos de abóbora cabotiá assada, rúcula e tomate cereja.',
            consumedAt: buildDate(0, 12, 20),
            isOnDiet: true,
          },
        ],
      });
    }

    const token = generateAuthToken(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        dietGoal: user.dietGoal,
        createdAt: user.createdAt,
      },
      token,
    };
  }
}
