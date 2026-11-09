import React from 'react';
import { DailyDietPoint } from '../../types/domain';

export interface WeeklyDietChartProps {
  data: DailyDietPoint[];
}

export const WeeklyDietChart: React.FC<WeeklyDietChartProps> = ({ data }) => {
  const maxTotal = Math.max(...data.map((d) => d.total), 4);

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Consistência nos últimos 7 dias</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Distribuição diária de refeições dentro e fora do plano
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500" />
            Na dieta
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-rose-400" />
            Fora da dieta
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 pt-4">
        {data.map((day) => {
          const onHeightPct = day.total > 0 ? (day.onDiet / maxTotal) * 100 : 0;
          const offHeightPct = day.total > 0 ? (day.offDiet / maxTotal) * 100 : 0;

          return (
            <div key={day.date} className="flex flex-col items-center h-full justify-end gap-2">
              <div className="w-full max-w-10 flex-1 flex flex-col justify-end rounded-lg bg-slate-100/80 p-1 overflow-hidden">
                {day.total === 0 ? (
                  <div className="h-1.5 w-full rounded-full bg-slate-200" />
                ) : (
                  <div className="flex flex-col justify-end w-full h-full gap-0.5">
                    {day.offDiet > 0 && (
                      <div
                        style={{ height: `${Math.max(offHeightPct, 12)}%` }}
                        title={`${day.offDiet} fora da dieta`}
                        className="w-full rounded-t-md rounded-b-xs bg-rose-400 transition-all duration-300"
                      />
                    )}
                    {day.onDiet > 0 && (
                      <div
                        style={{ height: `${Math.max(onHeightPct, 12)}%` }}
                        title={`${day.onDiet} dentro da dieta`}
                        className="w-full rounded-b-md rounded-t-xs bg-emerald-500 transition-all duration-300"
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="text-center">
                <p
                  className={`text-xs font-semibold ${
                    day.label === 'Hoje' ? 'text-emerald-700 font-bold' : 'text-slate-600'
                  }`}
                >
                  {day.label}
                </p>
                <p className="text-[11px] text-slate-400 tabular-nums">{day.total} ref.</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
