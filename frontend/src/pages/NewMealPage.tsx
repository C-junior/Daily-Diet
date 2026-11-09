import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MealForm } from '../components/meals/MealForm';
import { useToast } from '../contexts/ToastContext';
import { api } from '../services/api';
import { MealPayload } from '../types/domain';

export const NewMealPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateMeal = async (payload: MealPayload) => {
    setIsSubmitting(true);
    try {
      const { meal } = await api.meals.create(payload);
      showToast('Refeição registrada com sucesso!', 'success');
      navigate(
        `/meals/feedback?onDiet=${meal.isOnDiet ? 'true' : 'false'}&mealId=${meal.id}`,
        { replace: true },
      );
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Erro ao registrar refeição.',
        'error',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o diário
        </Link>
        <h1 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
          Nova refeição
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Registre o que você consumiu, a data, o horário e indique se faz parte do seu plano.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <MealForm
          submitLabel="Cadastrar refeição"
          isSubmitting={isSubmitting}
          onSubmit={handleCreateMeal}
          onCancel={() => navigate('/')}
        />
      </div>
    </div>
  );
};
