import { ArrowLeft, CalendarClock, Pencil, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { DeleteMealModal } from '../components/meals/DeleteMealModal';
import { DietBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useToast } from '../contexts/ToastContext';
import { api } from '../services/api';
import { Meal } from '../types/domain';
import { formatFullDateTime } from '../utils/date';

export const MealDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [meal, setMeal] = useState<Meal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleConfirmDelete = async () => {
    if (!meal) return;
    setIsDeleting(true);
    try {
      await api.meals.delete(meal.id);
      showToast('Refeição removida com sucesso.', 'success');
      navigate('/', { replace: true });
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Não foi possível excluir a refeição.',
        'error',
      );
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <div className="h-8 w-40 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-72 rounded-2xl bg-slate-200/80 animate-pulse" />
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div className="max-w-xl mx-auto rounded-2xl border border-rose-200 bg-white p-8 text-center">
        <h2 className="text-lg font-bold text-slate-900">
          Não foi possível carregar esta refeição
        </h2>
        <p className="mt-2 text-sm text-slate-500">{error}</p>
        <div className="mt-6">
          <Link to="/">
            <Button variant="primary">Voltar para o início</Button>
          </Link>
        </div>
      </div>
    );
  }

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
      </div>

      <article className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
        <div
          className={`px-6 sm:px-8 py-5 border-b ${
            meal.isOnDiet
              ? 'bg-emerald-50/70 border-emerald-100'
              : 'bg-rose-50/70 border-rose-100'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Detalhes da Refeição
            </span>
            <DietBadge isOnDiet={meal.isOnDiet} />
          </div>
          <h1 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            {meal.name}
          </h1>
        </div>

        <div className="p-6 sm:p-8 flex flex-col gap-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Descrição
            </h2>
            <p className="mt-2 text-base text-slate-700 leading-relaxed whitespace-pre-line">
              {meal.description}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Data e hora
            </h2>
            <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2">
              <CalendarClock className="h-4 w-4 text-slate-500" />
              {formatFullDateTime(meal.consumedAt)}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <Link to={`/meals/${meal.id}/edit`} className="flex-1">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={<Pencil className="h-4 w-4" />}
              >
                Editar refeição
              </Button>
            </Link>

            <Button
              type="button"
              variant="outline"
              size="lg"
              leftIcon={<Trash2 className="h-4 w-4 text-rose-600" />}
              onClick={() => setIsDeleteModalOpen(true)}
              className="sm:w-auto hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
            >
              Excluir refeição
            </Button>
          </div>
        </div>
      </article>

      <DeleteMealModal
        isOpen={isDeleteModalOpen}
        mealName={meal.name}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};
