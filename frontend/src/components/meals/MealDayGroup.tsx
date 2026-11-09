import React from 'react';
import { MealDayGroupData } from '../../utils/date';
import { MealCard } from './MealCard';

export interface MealDayGroupProps {
  group: MealDayGroupData;
}

export const MealDayGroup: React.FC<MealDayGroupProps> = ({ group }) => {
  const onDietCount = group.meals.filter((m) => m.isOnDiet).length;

  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between px-1">
        <div className="flex items-baseline gap-2">
          <h3 className="font-display text-base font-extrabold text-slate-900">
            {group.title}
          </h3>
          <span className="text-xs font-medium text-slate-400">{group.subtitle}</span>
        </div>
        <span className="text-xs font-medium text-slate-500">
          {onDietCount}/{group.meals.length} na dieta
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {group.meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>
    </section>
  );
};
