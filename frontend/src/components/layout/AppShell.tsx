import {
  BarChart3,
  LogOut,
  Plus,
  Target,
  Utensils,
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { GoalModal } from '../metrics/GoalModal';
import { BrandLogo } from './BrandLogo';

export const AppShell: React.FC = () => {
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const initials = (user?.name || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const handleSignOut = async () => {
    await signOut();
    showToast('Sessão encerrada com segurança.', 'info');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-68 lg:flex-col lg:fixed lg:inset-y-0 border-r border-slate-200/80 bg-white px-5 py-6 justify-between z-30">
        <div className="flex flex-col gap-8">
          <div className="px-2">
            <Link to="/">
              <BrandLogo size="md" />
            </Link>
          </div>

          <div className="px-1">
            <Link
              to="/meals/new"
              className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Plus className="h-4 w-4" />
              Nova refeição
            </Link>
          </div>

          <nav className="flex flex-col gap-1.5" aria-label="Menu principal">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Utensils className="h-4 w-4" />
              Diário de Refeições
            </NavLink>

            <NavLink
              to="/metrics"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <BarChart3 className="h-4 w-4" />
              Estatísticas & Evolução
            </NavLink>

            <button
              type="button"
              onClick={() => setIsGoalModalOpen(true)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer text-left"
            >
              <span className="flex items-center gap-3">
                <Target className="h-4 w-4" />
                Meta de Adesão
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                {user?.dietGoal ?? 80}%
              </span>
            </button>
          </nav>
        </div>

        {/* User Footer */}
        <div className="border-t border-slate-200/80 pt-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            title="Sair da conta"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 h-15">
        <Link to="/">
          <BrandLogo size="sm" />
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsGoalModalOpen(true)}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700"
          >
            <Target className="h-3.5 w-3.5 text-emerald-600" />
            Meta {user?.dietGoal ?? 80}%
          </button>
          <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">
            {initials}
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            aria-label="Sair da conta"
            className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 lg:pl-68 pb-24 lg:pb-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10 py-6 sm:py-9">
          <Outlet context={{ openGoalModal: () => setIsGoalModalOpen(true) }} />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav
        aria-label="Navegação inferior"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-md px-6 h-16 flex items-center justify-around"
      >
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-semibold transition-colors ${
              isActive ? 'text-emerald-600' : 'text-slate-500'
            }`
          }
        >
          <Utensils className="h-5 w-5" />
          <span>Refeições</span>
        </NavLink>

        <Link
          to="/meals/new"
          className="flex h-12 w-12 -mt-5 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg active:scale-95 transition-transform"
          aria-label="Registrar nova refeição"
        >
          <Plus className="h-6 w-6" />
        </Link>

        <NavLink
          to="/metrics"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-xs font-semibold transition-colors ${
              isActive ? 'text-emerald-600' : 'text-slate-500'
            }`
          }
        >
          <BarChart3 className="h-5 w-5" />
          <span>Métricas</span>
        </NavLink>
      </nav>

      <GoalModal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} />
    </div>
  );
};
