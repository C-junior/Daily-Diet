import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import { DietFilterStatus, Meal } from '../types/domain';

interface UseMealsParams {
  search?: string;
  status?: DietFilterStatus;
  date?: string;
}

export function useMeals(params: UseMealsParams = {}) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { meals: result } = await api.meals.list({
        search: params.search,
        status: params.status,
        date: params.date,
      });
      setMeals(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar refeições.');
    } finally {
      setIsLoading(false);
    }
  }, [params.search, params.status, params.date]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  return {
    meals,
    isLoading,
    error,
    refetch: fetchMeals,
  };
}
