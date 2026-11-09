import { Lock, Mail, Target, User as UserIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrandLogo } from '../components/layout/BrandLogo';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export const RegisterPage: React.FC = () => {
  const { signUp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dietGoal, setDietGoal] = useState(80);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (name.trim().length < 2) {
      setErrorMessage('Informe seu nome (mínimo de 2 caracteres).');
      return;
    }
    if (!email.includes('@')) {
      setErrorMessage('Informe um e-mail válido.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Crie uma senha com pelo menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
        dietGoal,
      });
      showToast('Conta criada com sucesso! Vamos começar seu diário.', 'success');
      navigate('/');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Não foi possível criar sua conta.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-9 shadow-sm">
        <div className="mb-6">
          <BrandLogo size="md" />
        </div>

        <h1 className="font-display text-2xl font-extrabold text-slate-900">
          Criar nova conta
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Configure seu perfil para registrar refeições e acompanhar suas métricas.
        </p>

        {errorMessage && (
          <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
          <Input
            label="Nome completo"
            name="name"
            placeholder="Ex.: Bruno Bandeira"
            leftIcon={<UserIcon className="h-4 w-4" />}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="E-mail"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            leftIcon={<Mail className="h-4 w-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Senha"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo de 6 caracteres"
            leftIcon={<Lock className="h-4 w-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Target className="h-3.5 w-3.5 text-emerald-600" />
                Meta inicial de refeições na dieta
              </span>
              <span className="text-sm font-extrabold text-emerald-700">{dietGoal}%</span>
            </div>
            <input
              type="range"
              min={60}
              max={100}
              step={5}
              value={dietGoal}
              onChange={(e) => setDietGoal(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <Button
            type="submit"
            variant="secondary"
            size="lg"
            fullWidth
            isLoading={isSubmitting}
            className="mt-2"
          >
            Começar meu Daily Diet
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Já possui cadastro?{' '}
          <Link
            to="/login"
            className="font-bold text-slate-900 hover:text-emerald-700 underline-offset-4 hover:underline"
          >
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
};
