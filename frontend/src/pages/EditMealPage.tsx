import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MealForm } from '../components/meals/MealForm';
import { Button } from '../components/ui/Button';
import { useToast } from '../contexts/ToastContext';
import { api } from '../services/api';
import { Meal, MealPayload } from '../types/domain';
import { isoToLocalInputs } from '../utils/date';

export const EditMealPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [meal, setMeal] = useState<Meal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    api.meals
      .getById(id)
      .then(({ meal: fetched }) => {
        setMeal(fetched);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Refeição não encontrada.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const handleUpdateMeal = async (payload: MealPayload) => {
    if (!meal) return;
    setIsSubmitting(true);
    try {
      await api.meals.update(meal.id, payload);
      showToast('Alterações salvas com sucesso!', 'success');
      navigate(`/meals/${meal.id}`, { replace: true });
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Não foi possível salvar as alterações.',
        'error',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <div className="h-8 w-44 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-96 rounded-2xl bg-slate-200/80 animate-pulse" />
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div className="max-w-xl mx-auto rounded-2xl border border-rose-200 bg-white p-8 text-center">
        <h2 className="text-lg font-bold text-slate-900">
          Não foi possível editar esta refeição
        </h2>
        <p className="mt-2 text-sm text-slate-500">{error}</p>
        <div className="mt-6">
          <Link to="/">
            <Button variant="primary">Voltar ao diário</Button>
          </Link>
        </div>
      </div>
    );
  }

  const localDateTime = isoToLocalInputs(meal.consumedAt);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link
          to={`/meals/${meal.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para detalhes
        </Link>
        <h1 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
          Editar refeição
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Atualize nome, descrição, data, horário ou indicação da dieta.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <MealForm
          initialValues={{
            name: meal.name,
            description: meal.description,
            date: localDateTime.date,
            time: localDateTime.time,
            isOnDiet: meal.isOnDiet,
          }}
          submitLabel="Salvar alterações"
          isSubmitting={isSubmitting}
          onSubmit={handleUpdateMeal}
          onCancel={() => navigate(`/meals/${meal.id}`)}
        />
      </div>
    </div>
  );
};
