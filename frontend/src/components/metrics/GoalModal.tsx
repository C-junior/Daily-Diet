import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

const PRESET_GOALS = [70, 75, 80, 85, 90, 95];

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose, onUpdated }) => {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useToast();
  const [goal, setGoal] = useState<number>(user?.dietGoal ?? 80);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.dietGoal) {
      setGoal(user.dietGoal);
    }
  }, [user?.dietGoal, isOpen]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfile({ dietGoal: goal });
      showToast(`Meta pessoal atualizada para ${goal}%!`, 'success');
      onUpdated?.();
      onClose();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Não foi possível salvar a meta.',
        'error',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Meta Pessoal de Adesão"
      description="Defina qual porcentagem mínima de refeições dentro da dieta você deseja manter no seu plano alimentar."
    >
      <form onSubmit={handleSave} className="flex flex-col gap-5">
        <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4 text-center">
          <span className="font-display text-4xl font-extrabold text-emerald-600 tabular-nums">
            {goal}%
          </span>
          <p className="mt-1 text-xs text-slate-500">
            {goal >= 90
              ? 'Foco alto / preparação intensa'
              : goal >= 80
                ? 'Equilíbrio ideal sustentável (regra 80/20)'
                : 'Flexibilidade moderada no dia a dia'}
          </p>
        </div>

        <input
          type="range"
          min={50}
          max={100}
          step={5}
          value={goal}
          onChange={(e) => setGoal(Number(e.target.value))}
          className="w-full accent-emerald-600 cursor-pointer"
          aria-label="Porcentagem da meta de adesão"
        />

        <div className="flex flex-wrap gap-2 justify-center">
          {PRESET_GOALS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setGoal(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                goal === preset
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {preset}%
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" variant="secondary" isLoading={isSaving}>
            Salvar meta
          </Button>
        </div>
      </form>
    </Modal>
  );
};
