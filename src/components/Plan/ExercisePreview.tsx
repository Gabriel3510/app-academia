import React from 'react';
import { Check, Repeat } from 'lucide-react';
import { usePreferences } from '../../contexts/preferences';
import type { PlanExercise } from '../../types';
import ExerciseImage from '../UI/ExerciseImage';
import Modal from '../UI/Modal';

interface ExercisePreviewProps {
  exercise: PlanExercise;
  done: boolean;
  onToggle: () => void;
  onSwap: () => void;
  onClose: () => void;
}

const ExercisePreview: React.FC<ExercisePreviewProps> = ({ exercise, done, onToggle, onSwap, onClose }) => {
  const { t, exerciseName, formatSets } = usePreferences();

  return (
    <Modal title={exerciseName(exercise.name)} onClose={onClose}>
      <div className="bg-white">
        <ExerciseImage name={exercise.name} eager className="w-full aspect-square max-h-[55dvh]" />
      </div>
      <div className="p-5 space-y-4">
        <p className="text-2xl font-bold tabular-nums">{formatSets(exercise.sets)}</p>
        <div className="flex gap-3">
          <button onClick={onSwap} className="btn-secondary flex-1"><Repeat size={16} /> {t('plan.swap')}</button>
          <button onClick={onToggle} className={`flex-1 ${done ? 'btn-secondary' : 'btn-primary'}`}>
            <Check size={16} /> {done ? t('plan.unmarkItem') : t('plan.markItem')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ExercisePreview;
