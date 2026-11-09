import { ArrowUpRight, Flame, Sparkles } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { UserMetrics } from '../../types/domain';

export interface AdherenceBannerProps {
  metrics: UserMetrics | null;
  isLoading?: boolean;
}

export const AdherenceBanner: React.FC<AdherenceBannerProps> = ({
  metrics,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="h-36 rounded-2xl bg-slate-200/70 animate-pulse border border-slate-200" />
    );
  }

  const hasMeals = (metrics?.totalMeals ?? 0) > 0;
  const isPositive = !hasMeals || (metrics?.isWithinGoal ?? true);
  const percentageFormatted = hasMeals
    ? `${metrics!.onDietPercentage.toFixed(1).replace('.', ',')}%`
    : '—';

  return (
    <Link
      to="/metrics"
      className={`group relative overflow-hidden rounded-2xl border p-6 transition-all shadow-xs hover:shadow-md block ${
        isPositive
          ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 via-emerald-50/80 to-teal-50/70'
          : 'border-rose-200 bg-gradient-to-br from-rose-50 via-rose-50/80 to-orange-50/60'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700 border border-white shadow-2xs mb-3">
            {hasMeals ? (
              <>
                <Flame
                  className={`h-3.5 w-3.5 ${
                    isPositive ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                />
                <span>
                  Sequência atual: <strong>{metrics?.currentOnDietStreak ?? 0}</strong>{' '}
                  {metrics?.currentOnDietStreak === 1 ? 'refeição' : 'refeições'}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>Comece seu diário alimentar hoje</span>
              </>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <span
              className={`font-display text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums ${
                isPositive ? 'text-emerald-950' : 'text-rose-950'
              }`}
            >
              {percentageFormatted}
            </span>
            {hasMeals && (
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  isPositive
                    ? 'bg-emerald-200/60 text-emerald-900'
                    : 'bg-rose-200/60 text-rose-900'
                }`}
              >
                Meta {metrics?.dietGoal ?? 80}%
              </span>
            )}
          </div>

          <p
            className={`mt-1.5 text-sm font-medium ${
              isPositive ? 'text-emerald-800/90' : 'text-rose-800/90'
            }`}
          >
            {hasMeals
              ? 'das refeições registradas estão dentro da sua dieta'
              : 'Registre sua primeira refeição para acompanhar sua taxa de adesão'}
          </p>
        </div>

        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 border border-white shadow-2xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
            isPositive ? 'text-emerald-700' : 'text-rose-700'
          }`}
          aria-label="Ver estatísticas detalhadas"
        >
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
    </Link>
  );
};
