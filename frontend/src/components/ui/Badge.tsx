import React from 'react';

export interface DietBadgeProps {
  isOnDiet: boolean;
  size?: 'sm' | 'md';
}

export const DietBadge: React.FC<DietBadgeProps> = ({ isOnDiet, size = 'md' }) => {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-semibold ${
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-xs'
      } ${
        isOnDiet
          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
          : 'bg-rose-50 text-rose-800 border border-rose-200/80'
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${isOnDiet ? 'bg-emerald-600' : 'bg-rose-600'}`}
        aria-hidden="true"
      />
      {isOnDiet ? 'dentro da dieta' : 'fora da dieta'}
    </span>
  );
};
