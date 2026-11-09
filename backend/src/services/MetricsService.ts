import { AppError } from '../errors/AppError';
import { prisma } from '../lib/prisma';

export interface DailyDietPoint {
  date: string;
  label: string;
  onDiet: number;
  offDiet: number;
  total: number;
}

export interface UserMetricsResponse {
  totalMeals: number;
  onDietMeals: number;
  offDietMeals: number;
  bestOnDietStreak: number;
  currentOnDietStreak: number;
  onDietPercentage: number;
  dietGoal: number;
  isWithinGoal: boolean;
  dailyHistory: DailyDietPoint[];
}

const WEEKDAY_SHORT_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export class MetricsService {
  async getUserMetrics(userId: string): Promise<UserMetricsResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, dietGoal: true },
    });

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    const meals = await prisma.meal.findMany({
      where: { userId },
      orderBy: [{ consumedAt: 'asc' }, { createdAt: 'asc' }],
    });

    const totalMeals = meals.length;
    let onDietMeals = 0;
    let offDietMeals = 0;
    let currentStreak = 0;
    let bestOnDietStreak = 0;

    for (const meal of meals) {
      if (meal.isOnDiet) {
        onDietMeals += 1;
        currentStreak += 1;
        if (currentStreak > bestOnDietStreak) {
          bestOnDietStreak = currentStreak;
        }
      } else {
        offDietMeals += 1;
        currentStreak = 0;
      }
    }

    const onDietPercentage =
      totalMeals === 0 ? 0 : Number(((onDietMeals / totalMeals) * 100).toFixed(1));

    // Constrói histórico dos últimos 7 dias para visualização gráfica no frontend
    const dailyMap = new Map<string, DailyDietPoint>();
    const today = new Date();

    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = toLocalDateKey(d);
      dailyMap.set(key, {
        date: key,
        label: i === 0 ? 'Hoje' : WEEKDAY_SHORT_PT[d.getDay()],
        onDiet: 0,
        offDiet: 0,
        total: 0,
      });
    }

    for (const meal of meals) {
      const key = toLocalDateKey(meal.consumedAt);
      const bucket = dailyMap.get(key);
      if (bucket) {
        bucket.total += 1;
        if (meal.isOnDiet) {
          bucket.onDiet += 1;
        } else {
          bucket.offDiet += 1;
        }
      }
    }

    return {
      totalMeals,
      onDietMeals,
      offDietMeals,
      bestOnDietStreak,
      currentOnDietStreak: currentStreak,
      onDietPercentage,
      dietGoal: user.dietGoal,
      isWithinGoal: totalMeals === 0 ? true : onDietPercentage >= user.dietGoal,
      dailyHistory: Array.from(dailyMap.values()),
    };
  }
}
