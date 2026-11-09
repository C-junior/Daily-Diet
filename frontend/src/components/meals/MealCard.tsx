import { ChevronRight } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { Meal } from '../../types/domain';
import { formatTime } from '../../utils/date';

export interface MealCardProps {
  meal: Meal;
}

export const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  return (
    <Link
      to={`/meals/${meal.id}`}
      className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 hover:border-slate-300 hover:shadow-xs transition-all"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <span className="text-xs font-bold text-slate-700 tabular-nums shrink-0">
          {formatTime(meal.consumedAt)}
        </span>
        <span className="h-4 w-px bg-slate-200 shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
            {meal.name}
          </p>
          <p className="text-xs text-slate-500 truncate mt-0.5">{meal.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <span
          title={meal.isOnDiet ? 'Dentro da dieta' : 'Fora da dieta'}
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            meal.isOnDiet
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
              : 'bg-rose-50 text-rose-700 border border-rose-200/80'
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              meal.isOnDiet ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          />
          <span className="hidden sm:inline">
            {meal.isOnDiet ? 'Na dieta' : 'Fora da dieta'}
          </span>
        </span>
        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
      </div>
    </Link>
  );
};
