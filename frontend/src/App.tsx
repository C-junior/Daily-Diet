import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute, PublicOnlyRoute } from './components/layout/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { DashboardPage } from './pages/DashboardPage';
import { EditMealPage } from './pages/EditMealPage';
import { LoginPage } from './pages/LoginPage';
import { MealDetailsPage } from './pages/MealDetailsPage';
import { MealFeedbackPage } from './pages/MealFeedbackPage';
import { MetricsPage } from './pages/MetricsPage';
import { NewMealPage } from './pages/NewMealPage';
import { RegisterPage } from './pages/RegisterPage';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rotas públicas (Login & Cadastro) */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Rotas autenticadas da aplicação */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/meals/new" element={<NewMealPage />} />
                <Route path="/meals/feedback" element={<MealFeedbackPage />} />
                <Route path="/meals/:id" element={<MealDetailsPage />} />
                <Route path="/meals/:id/edit" element={<EditMealPage />} />
                <Route path="/metrics" element={<MetricsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};
