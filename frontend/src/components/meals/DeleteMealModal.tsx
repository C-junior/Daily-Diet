import React from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export interface DeleteMealModalProps {
  isOpen: boolean;
  mealName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteMealModal: React.FC<DeleteMealModalProps> = ({
  isOpen,
  mealName,
  isDeleting,
  onConfirm,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Apagar registro de refeição?"
      description={`Tem certeza que deseja excluir "${mealName}"? Essa ação é permanente e atualizará suas métricas imediatamente.`}
    >
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isDeleting}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={onConfirm}
          isLoading={isDeleting}
          className="w-full sm:w-auto"
        >
          Sim, excluir refeição
        </Button>
      </div>
    </Modal>
  );
};
