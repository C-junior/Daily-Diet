export interface User {
  id: string;
  name: string;
  email: string;
  dietGoal: number;
  createdAt: string;
}

export interface Meal {
  id: string;
  userId: string;
  name: string;
  description: string;
  consumedAt: string;
  isOnDiet: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MealFormValues {
  name: string;
  description: string;
  date: string;
  time: string;
  isOnDiet: boolean;
}

export interface MealPayload {
  name: string;
  description: string;
  consumedAt: string;
  isOnDiet: boolean;
}

export type DietFilterStatus = 'all' | 'on' | 'off';

export interface DailyDietPoint {
  date: string;
  label: string;
  onDiet: number;
  offDiet: number;
  total: number;
}

export interface UserMetrics {
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
