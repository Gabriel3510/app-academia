import React from 'react';
import { ArrowDown, ArrowUp, Check } from 'lucide-react';
import { usePreferences } from '../../contexts/preferences';
import { useToast } from '../../contexts/toast';
import { useWorkout } from '../../contexts/workout';
import { DAY_KEYS } from '../../types';
import type { PlanDay, PlanExercise } from '../../types';
import { getExerciseOptions } from '../../utils/training';
import ExerciseImage from '../UI/ExerciseImage';
import Sheet from '../UI/Sheet';

interface ExerciseMenuProps {
  day: PlanDay;
  exercise: PlanExercise;
  onClose: () => void;
}

const ExerciseMenu: React.FC<ExerciseMenuProps> = ({ day, exercise, onClose }) => {
  const { t, exerciseName, dayName } = usePreferences();
  const { activeGroup, swapExercise, moveExercise, reorderExercise } = useWorkout();
  const { showToast } = useToast();
  const options = getExerciseOptions(day, exercise, activeGroup);
  const exercises = day.exercises ?? [];
  const index = exercises.findIndex((item) => item.id === exercise.id);

  const swap = (name: string) => {
    if (name !== exercise.name) {
      swapExercise(day.key, exercise.id, name);
      showToast({ kind: 'success', message: t('plan.swapped', { name: exerciseName(name) }) });
    }
    onClose();
  };

  const move = (to: PlanDay['key']) => {
    moveExercise(day.key, exercise.id, to);
    showToast({ kind: 'success', message: t('plan.moved', { day: dayName(to) }) });
    onClose();
  };

  return (
    <Sheet title={exerciseName(exercise.name)} onClose={onClose}>
      <div className="overflow-y-auto">
        <section className="p-3">
          <h3 className="section-title px-2">{t('plan.swap')}</h3>
          <p className="text-xs text-subtle px-2 mb-2">{t('plan.swapHint')}</p>
          <ul className="space-y-1">
            {options.map((name) => {
              const selected = name === exercise.name;
              return (
                <li key={name}>
                  <button
                    type="button"
                    data-autofocus={selected || undefined}
                    aria-pressed={selected}
                    onClick={() => swap(name)}
                    className={`w-full flex items-center gap-3 p-2 rounded-xl text-left text-sm transition-colors ${selected ? 'bg-primary-soft font-semibold' : 'hover:bg-surface-2'}`}
                  >
                    <ExerciseImage name={name} className="w-12 h-12 rounded-lg flex-shrink-0" />
                    <span className="flex-1 min-w-0">{exerciseName(name)}</span>
                    {selected && <Check size={18} className="text-accent flex-shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="p-3 border-t border-line">
          <h3 className="section-title px-2 mb-2">{t('plan.move')}</h3>
          <div className="grid grid-cols-5 gap-1.5">
            {DAY_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                disabled={key === day.key}
                onClick={() => move(key)}
                className="min-h-[42px] rounded-xl text-sm font-medium bg-surface-2 hover:bg-primary-soft disabled:bg-primary disabled:text-on-primary disabled:opacity-100"
              >
                {t(`dayShort.${key}`)}
              </button>
            ))}
          </div>
        </section>

        <section className="p-3 border-t border-line flex gap-2">
          <button type="button" disabled={index <= 0} onClick={() => reorderExercise(day.key, exercise.id, -1)} className="btn-secondary flex-1">
            <ArrowUp size={16} /> {t('plan.moveUp')}
          </button>
          <button type="button" disabled={index < 0 || index >= exercises.length - 1} onClick={() => reorderExercise(day.key, exercise.id, 1)} className="btn-secondary flex-1">
            <ArrowDown size={16} /> {t('plan.moveDown')}
          </button>
        </section>
      </div>
    </Sheet>
  );
};

export default ExerciseMenu;
