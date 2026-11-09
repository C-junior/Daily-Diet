import { Plus, Search, SlidersHorizontal, Utensils, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MealDayGroup } from '../components/meals/MealDayGroup';
import { AdherenceBanner } from '../components/metrics/AdherenceBanner';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useAuth } from '../contexts/AuthContext';
import { useMeals } from '../hooks/useMeals';
import { useMetrics } from '../hooks/useMetrics';
import { DietFilterStatus } from '../types/domain';
import { groupMealsByDay } from '../utils/date';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<DietFilterStatus>('all');
  const [dateFilter, setDateFilter] = useState('');

  const { meals, isLoading: isLoadingMeals, error: mealsError } = useMeals({
    search: searchInput,
    status: statusFilter,
    date: dateFilter || undefined,
  });

  const { metrics, isLoading: isLoadingMetrics } = useMetrics();

  const groupedMeals = useMemo(() => groupMealsByDay(meals), [meals]);

  const firstName = user?.name?.split(' ')[0] || 'Olá';
  const hasActiveFilters =
    searchInput.trim().length > 0 || statusFilter !== 'all' || dateFilter.length > 0;

  const clearFilters = () => {
    setSearchInput('');
    setStatusFilter('all');
    setDateFilter('');
  };

  return (
    <div className="flex flex-col gap-7 animate-fade-in">
      {/* Top Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Olá, {firstName} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Acompanhe suas escolhas alimentares e mantenha sua rotina consistente.
          </p>
        </div>

        <Link to="/meals/new" className="hidden sm:inline-flex">
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            Nova refeição
          </Button>
        </Link>
      </div>

      {/* Hero Adherence Card */}
      <AdherenceBanner metrics={metrics} isLoading={isLoadingMetrics} />

      {/* Meals Section Header & Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900">Suas refeições</h2>
          <Link to="/meals/new" className="sm:hidden">
            <Button size="sm" variant="primary" leftIcon={<Plus className="h-3.5 w-3.5" />}>
              Nova refeição
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="search"
              placeholder="Buscar por refeição ou ingrediente..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 self-start md:self-auto">
            {(
              [
                { key: 'all', label: 'Todas' },
                { key: 'on', label: 'Na dieta' },
                { key: 'off', label: 'Fora' },
              ] as const
            ).map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setStatusFilter(option.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  statusFilter === option.key
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Optional Date Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="date"
                aria-label="Filtrar por data"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 focus:border-slate-900 focus:outline-none"
              />
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                title="Limpar filtros"
                className="inline-flex items-center gap-1 h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Meals List */}
      {mealsError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {mealsError}
        </div>
      ) : isLoadingMeals ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((skeleton) => (
            <div
              key={skeleton}
              className="h-16 rounded-xl bg-slate-200/70 animate-pulse border border-slate-200/60"
            />
          ))}
        </div>
      ) : groupedMeals.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            icon={<SlidersHorizontal className="h-6 w-6" />}
            title="Nenhuma refeição encontrada para este filtro"
            description="Tente ajustar os termos da pesquisa ou limpar os filtros ativos para ver todo o seu histórico."
            action={
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpar filtros
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={<Utensils className="h-6 w-6" />}
            title="Seu diário alimentar ainda está vazio"
            description="Registre sua primeira refeição para começar a acompanhar sua sequência dentro da dieta e suas estatísticas."
            action={
              <Link to="/meals/new">
                <Button variant="secondary" leftIcon={<Plus className="h-4 w-4" />}>
                  Registrar primeira refeição
                </Button>
              </Link>
            }
          />
        )
      ) : (
        <div className="flex flex-col gap-6">
          {groupedMeals.map((group) => (
            <MealDayGroup key={group.dateKey} group={group} />
          ))}
        </div>
      )}
    </div>
  );
};
