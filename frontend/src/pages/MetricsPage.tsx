import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Flame,
  Plus,
  Target,
  UtensilsCrossed,
  XCircle,
} from 'lucide-react';
import React, { useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { WeeklyDietChart } from '../components/metrics/WeeklyDietChart';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useMetrics } from '../hooks/useMetrics';

interface OutletContextType {
  openGoalModal?: () => void;
}

export const MetricsPage: React.FC = () => {
  const { user } = useAuth();
  const { metrics, isLoading, error, refetch } = useMetrics();
  const outletContext = useOutletContext<OutletContextType | undefined>();

  useEffect(() => {
    refetch();
  }, [user?.dietGoal, refetch]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        <div className="h-40 rounded-2xl bg-slate-200/80 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-28 rounded-2xl bg-slate-200/80 animate-pulse" />
          <div className="h-28 rounded-2xl bg-slate-200/80 animate-pulse" />
        </div>
        <div className="h-56 rounded-2xl bg-slate-200/80 animate-pulse" />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        {error ?? 'Não foi possível carregar suas métricas.'}
      </div>
    );
  }

  const hasMeals = metrics.totalMeals > 0;
  const isPositive = !hasMeals || metrics.isWithinGoal;
  const percentageDisplay = hasMeals
    ? `${metrics.onDietPercentage.toFixed(1).replace('.', ',')}%`
    : '0,0%';

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Navigation Back */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o diário
        </Link>

        {outletContext?.openGoalModal && (
          <button
            type="button"
            onClick={outletContext.openGoalModal}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Target className="h-3.5 w-3.5 text-emerald-600" />
            Ajustar meta ({metrics.dietGoal}%)
          </button>
        )}
      </div>

      {/* Hero Percentage Header */}
      <div
        className={`rounded-2xl border p-7 sm:p-9 text-center ${
          isPositive
            ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 via-emerald-50/90 to-teal-50/70'
            : 'border-rose-200 bg-gradient-to-br from-rose-50 via-rose-50/90 to-orange-50/60'
        }`}
      >
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold mb-3 ${
            isPositive
              ? 'bg-emerald-200/60 text-emerald-900'
              : 'bg-rose-200/60 text-rose-900'
          }`}
        >
          {!hasMeals
            ? 'Sem registros ainda'
            : isPositive
              ? `Meta de ${metrics.dietGoal}% atingida`
              : `Abaixo da meta de ${metrics.dietGoal}%`}
        </span>

        <h1
          className={`font-display text-5xl sm:text-6xl font-extrabold tracking-tight tabular-nums ${
            isPositive ? 'text-emerald-950' : 'text-rose-950'
          }`}
        >
          {percentageDisplay}
        </h1>
        <p
          className={`mt-2 text-sm sm:text-base font-medium ${
            isPositive ? 'text-emerald-800' : 'text-rose-800'
          }`}
        >
          das refeições dentro da dieta
        </p>

        {/* Progress Bar */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="h-2.5 w-full rounded-full bg-white/80 overflow-hidden border border-white">
            <div
              style={{ width: `${Math.min(metrics.onDietPercentage, 100)}%` }}
              className={`h-full rounded-full transition-all duration-500 ${
                isPositive ? 'bg-emerald-600' : 'bg-rose-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* General Statistics Section */}
      <div>
        <h2 className="font-display text-lg font-bold text-slate-900 mb-3.5">
          Estatísticas gerais
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Best Streak Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200/70 shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <span className="font-display text-3xl font-extrabold text-slate-900 tabular-nums">
                {metrics.bestOnDietStreak}
              </span>
              <p className="text-sm font-medium text-slate-600 mt-0.5">
                melhor sequência de pratos dentro da dieta
              </p>
              <p className="text-xs text-slate-400 mt-1 inline-flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                Sequência atual: <strong>{metrics.currentOnDietStreak}</strong>
              </p>
            </div>
          </div>

          {/* Total Registered Meals Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700 border border-slate-200/80 shrink-0">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <div>
              <span className="font-display text-3xl font-extrabold text-slate-900 tabular-nums">
                {metrics.totalMeals}
              </span>
              <p className="text-sm font-medium text-slate-600 mt-0.5">
                refeições registradas no total
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Histórico consolidado da sua conta
              </p>
            </div>
          </div>

          {/* Meals Within Diet */}
          <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/70 p-5 flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <span className="font-display text-3xl font-extrabold text-emerald-950 tabular-nums">
                {metrics.onDietMeals}
              </span>
              <p className="text-sm font-semibold text-emerald-900/85 mt-0.5">
                refeições dentro da dieta
              </p>
            </div>
          </div>

          {/* Meals Outside Diet */}
          <div className="rounded-2xl border border-rose-200/90 bg-rose-50/70 p-5 flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-700 shrink-0">
              <XCircle className="h-6 w-6" />
            </div>
            <div>
              <span className="font-display text-3xl font-extrabold text-rose-950 tabular-nums">
                {metrics.offDietMeals}
              </span>
              <p className="text-sm font-semibold text-rose-900/85 mt-0.5">
                refeições fora da dieta
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-day consistency chart */}
      <WeeklyDietChart data={metrics.dailyHistory} />

      {!hasMeals && (
        <div className="flex justify-center pt-2">
          <Link to="/meals/new">
            <Button variant="secondary" size="lg" leftIcon={<Plus className="h-4 w-4" />}>
              Registrar minha primeira refeição
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
