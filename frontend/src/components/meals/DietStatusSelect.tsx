import React from 'react';

export interface DietStatusSelectProps {
  value: boolean | null;
  onChange: (isOnDiet: boolean) => void;
  error?: string;
}

export const DietStatusSelect: React.FC<DietStatusSelectProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-slate-700">Está dentro da dieta?</span>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex items-center justify-center gap-2.5 h-12 rounded-xl border font-semibold text-sm transition-all cursor-pointer ${
            value === true
              ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
              : 'border-slate-200 bg-slate-50/80 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
          Sim
        </button>

        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex items-center justify-center gap-2.5 h-12 rounded-xl border font-semibold text-sm transition-all cursor-pointer ${
            value === false
              ? 'border-rose-600 bg-rose-50 text-rose-900 ring-2 ring-rose-500/20'
              : 'border-slate-200 bg-slate-50/80 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-rose-600" />
          Não
        </button>
      </div>
      {error && <span className="text-xs font-medium text-rose-600">{error}</span>}
    </div>
  );
};
