import { CheckCircle2, Flame, Lock, Mail, Sparkles, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrandLogo } from '../components/layout/BrandLogo';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export const LoginPage: React.FC = () => {
  const { signIn, signInDemo } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Preencha seu e-mail e senha para entrar.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn({ email: email.trim(), password });
      showToast('Bem-vindo de volta ao Daily Diet!', 'success');
      navigate('/');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Não foi possível autenticar sua conta.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoAccess = async () => {
    setErrorMessage(null);
    setIsLoadingDemo(true);
    try {
      await signInDemo();
      showToast('Sessão de demonstração iniciada com histórico de refeições!', 'success');
      navigate('/');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Erro ao acessar conta de demonstração.',
      );
    } finally {
      setIsLoadingDemo(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left Brand Showcase */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 bg-slate-950 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <BrandLogo size="lg" light />
        </div>

        <div className="relative z-10 max-w-lg">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-400/25 px-3.5 py-1 text-xs font-semibold text-emerald-300 mb-5">
            <Sparkles className="h-3.5 w-3.5" />
            Nutrição consciente & sem complicações
          </span>
          <h1 className="font-display text-4xl font-extrabold tracking-tight leading-tight">
            Construa consistência alimentar uma refeição por vez.
          </h1>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            Registre suas refeições em segundos, visualize sua melhor sequência dentro da dieta e
            mantenha o equilíbrio sustentável no seu dia a dia.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3.5">
            <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              <Flame className="h-5 w-5 text-emerald-400 shrink-0" />
              <span className="text-sm text-slate-200">
                Acompanhamento automático da sua melhor sequência na dieta
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              <TrendingUp className="h-5 w-5 text-emerald-400 shrink-0" />
              <span className="text-sm text-slate-200">
                Métricas em tempo real e evolução semanal clara
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
              <span className="text-sm text-slate-200">
                Histórico organizado por dia com privacidade total por conta
              </span>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} Daily Diet — Saúde e consistência diária.
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="lg:col-span-7 xl:col-span-6 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <BrandLogo size="lg" />
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Continue registrando suas refeições e acompanhando suas metas.
          </p>

          {errorMessage && (
            <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
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
              autoComplete="current-password"
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              disabled={isLoadingDemo}
              className="mt-2"
            >
              Entrar na minha conta
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 font-semibold text-slate-400">
                ou experimente agora
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            fullWidth
            isLoading={isLoadingDemo}
            disabled={isSubmitting}
            leftIcon={<Sparkles className="h-4 w-4 text-emerald-600" />}
            onClick={handleDemoAccess}
          >
            Explorar com conta de demonstração
          </Button>

          <p className="mt-7 text-center text-sm text-slate-600">
            Ainda não tem uma conta?{' '}
            <Link
              to="/register"
              className="font-bold text-emerald-700 hover:text-emerald-800 underline-offset-4 hover:underline"
            >
              Criar conta gratuita
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
