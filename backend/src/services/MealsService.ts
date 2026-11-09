import { Meal } from '@prisma/client';
import { AppError } from '../errors/AppError';
import { prisma } from '../lib/prisma';
import { ListMealsQueryInput, MealPayloadInput } from '../schemas/mealSchemas';

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export class MealsService {
  async create(userId: string, data: MealPayloadInput): Promise<Meal> {
    const meal = await prisma.meal.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        consumedAt: data.consumedAt,
        isOnDiet: data.isOnDiet,
      },
    });

    return meal;
  }

  async listByUser(userId: string, filters: ListMealsQueryInput): Promise<Meal[]> {
    const meals = await prisma.meal.findMany({
      where: {
        userId,
        ...(filters.status === 'on' ? { isOnDiet: true } : {}),
        ...(filters.status === 'off' ? { isOnDiet: false } : {}),
      },
      orderBy: [{ consumedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return meals.filter((meal) => {
      if (filters.date) {
        const y = meal.consumedAt.getFullYear();
        const m = String(meal.consumedAt.getMonth() + 1).padStart(2, '0');
        const d = String(meal.consumedAt.getDate()).padStart(2, '0');
        const mealLocalDate = `${y}-${m}-${d}`;
        if (mealLocalDate !== filters.date) {
          return false;
        }
      }

      if (filters.search && filters.search.length > 0) {
        const needle = normalizeText(filters.search);
        const haystack = normalizeText(`${meal.name} ${meal.description}`);
        if (!haystack.includes(needle)) {
          return false;
        }
      }

      return true;
    });
  }

  async getById(userId: string, mealId: string): Promise<Meal> {
    const meal = await prisma.meal.findUnique({
      where: { id: mealId },
    });

    if (!meal) {
      throw new AppError('Refeição não encontrada.', 404);
    }

    if (meal.userId !== userId) {
      throw new AppError('Você não tem permissão para visualizar esta refeição.', 403);
    }

    return meal;
  }

  async update(userId: string, mealId: string, data: MealPayloadInput): Promise<Meal> {
    const existingMeal = await prisma.meal.findUnique({
      where: { id: mealId },
    });

    if (!existingMeal) {
      throw new AppError('Refeição não encontrada.', 404);
    }

    if (existingMeal.userId !== userId) {
      throw new AppError('Você não tem permissão para editar esta refeição.', 403);
    }

    const updatedMeal = await prisma.meal.update({
      where: { id: mealId },
      data: {
        name: data.name,
        description: data.description,
        consumedAt: data.consumedAt,
        isOnDiet: data.isOnDiet,
      },
    });

    return updatedMeal;
  }

  async delete(userId: string, mealId: string): Promise<void> {
    const existingMeal = await prisma.meal.findUnique({
      where: { id: mealId },
    });

    if (!existingMeal) {
      throw new AppError('Refeição não encontrada.', 404);
    }

    if (existingMeal.userId !== userId) {
      throw new AppError('Você não tem permissão para apagar esta refeição.', 403);
    }

    await prisma.meal.delete({
      where: { id: mealId },
    });
  }
}
