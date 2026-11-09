import { HeartHandshake, PartyPopper } from 'lucide-react';
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const MealFeedbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isOnDiet = searchParams.get('onDiet') !== 'false';
  const mealId = searchParams.get('mealId');

  return (
    <div className="min-h-[65vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
      <div
        className={`flex h-20 w-20 items-center justify-center rounded-3xl mb-6 border shadow-sm ${
          isOnDiet
            ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
            : 'bg-rose-50 border-rose-200 text-rose-600'
        }`}
      >
        {isOnDiet ? (
          <PartyPopper className="h-10 w-10" />
        ) : (
          <HeartHandshake className="h-10 w-10" />
        )}
      </div>

      <h1
        className={`font-display text-3xl sm:text-4xl font-extrabold ${
          isOnDiet ? 'text-emerald-700' : 'text-rose-700'
        }`}
      >
        {isOnDiet ? 'Continue assim!' : 'Que pena!'}
      </h1>

      <p className="mt-3 max-w-md text-base text-slate-600 leading-relaxed">
        {isOnDiet ? (
          <>
            Você continua <strong className="text-slate-900">dentro da dieta</strong>. Muito bem!
            Cada boa escolha fortalece sua sequência.
          </>
        ) : (
          <>
            Você <strong className="text-slate-900">saiu da dieta</strong> dessa vez, mas tudo bem!
            Equilíbrio faz parte do processo — retome o foco na próxima refeição!
          </>
        )}
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Link to="/">
          <Button variant="primary" size="lg">
            Ir para a página inicial
          </Button>
        </Link>
        {mealId && (
          <Link to={`/meals/${mealId}`}>
            <Button variant="outline" size="lg">
              Ver detalhes da refeição
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
