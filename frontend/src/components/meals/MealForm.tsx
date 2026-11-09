import React, { useState } from 'react';
import { MealFormValues, MealPayload } from '../../types/domain';
import { getNowDateAndTimeInputs, localInputsToIso } from '../../utils/date';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { DietStatusSelect } from './DietStatusSelect';

export interface MealFormProps {
  initialValues?: MealFormValues;
  submitLabel: string;
  isSubmitting?: boolean;
  onSubmit: (payload: MealPayload) => Promise<void>;
  onCancel?: () => void;
}

interface FormErrors {
  name?: string;
  description?: string;
  date?: string;
  time?: string;
  isOnDiet?: string;
}

export const MealForm: React.FC<MealFormProps> = ({
  initialValues,
  submitLabel,
  isSubmitting = false,
  onSubmit,
  onCancel,
}) => {
  const defaults = getNowDateAndTimeInputs();

  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [date, setDate] = useState(initialValues?.date ?? defaults.date);
  const [time, setTime] = useState(initialValues?.time ?? defaults.time);
  const [isOnDiet, setIsOnDiet] = useState<boolean | null>(
    initialValues ? initialValues.isOnDiet : true,
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!name.trim() || name.trim().length < 2) {
      nextErrors.name = 'Informe o nome da refeição (mínimo de 2 caracteres).';
    }
    if (!description.trim() || description.trim().length < 2) {
      nextErrors.description = 'Descreva o que compôs sua refeição.';
    }
    if (!date) {
      nextErrors.date = 'Selecione a data.';
    }
    if (!time) {
      nextErrors.time = 'Informe o horário.';
    }
    if (isOnDiet === null) {
      nextErrors.isOnDiet = 'Indique se a refeição está dentro ou fora da dieta.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate() || isOnDiet === null) return;

    await onSubmit({
      name: name.trim(),
      description: description.trim(),
      consumedAt: localInputsToIso(date, time),
      isOnDiet,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <Input
        label="Nome da refeição"
        name="name"
        placeholder="Ex.: Almoço grelhado com legumes, Café da manhã..."
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
        }}
        error={errors.name}
        maxLength={120}
      />

      <Textarea
        label="Descrição"
        name="description"
        placeholder="Ex.: 150g de frango grelhado, arroz integral, feijão e salada verde temperada com azeite."
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
        }}
        error={errors.description}
        rows={4}
        maxLength={1000}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Data"
          name="date"
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
          }}
          error={errors.date}
        />

        <Input
          label="Hora"
          name="time"
          type="time"
          value={time}
          onChange={(e) => {
            setTime(e.target.value);
            if (errors.time) setErrors((prev) => ({ ...prev, time: undefined }));
          }}
          error={errors.time}
        />
      </div>

      <DietStatusSelect
        value={isOnDiet}
        onChange={(selected) => {
          setIsOnDiet(selected);
          if (errors.isOnDiet) setErrors((prev) => ({ ...prev, isOnDiet: undefined }));
        }}
        error={errors.isOnDiet}
      />

      <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full sm:w-auto sm:min-w-52"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
