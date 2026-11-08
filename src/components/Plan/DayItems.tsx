import React, { useState } from 'react';
import { HeartPulse, Lightbulb, MoreVertical } from 'lucide-react';
import { usePreferences } from '../../contexts/preferences';
import { useToast } from '../../contexts/toast';
import { useWorkout } from '../../contexts/workout';
import type { TranslationKey } from '../../i18n/translations';
import type { DayKey } from '../../types';
import { isDayDone, isItemDone, itemKey } from '../../utils/week';
import ExerciseImage from '../UI/ExerciseImage';
import CheckButton from './CheckButton';
import ExerciseMenu from './ExerciseMenu';
import ExercisePreview from './ExercisePreview';

interface DayItemsProps {
  dayKey: DayKey;
  /** Marks the first exercise row for the guided tour */
  tour?: boolean;
}

const DayItems: React.FC<DayItemsProps> = ({ dayKey, tour }) => {
  const { t, exerciseName, dayName, formatSets } = usePreferences();
  const { week, getDay, toggleItem } = useWorkout();
  const { showToast } = useToast();
  const [menuId, setMenuId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const day = getDay(dayKey);
  const exercises = day.exercises ?? [];
  const menuExercise = exercises.find((item) => item.id === menuId);
  const previewExercise = exercises.find((item) => item.id === previewId);

  const toggle = (itemId: string) => {
    const completesDay = !isItemDone(week, dayKey, itemId) && !isDayDone(week, day)
      && isDayDone({ ...week, items: [...week.items, itemKey(dayKey, itemId)] }, day);
    toggleItem(dayKey, itemId);
    if (completesDay) showToast({ kind: 'success', message: t('plan.dayDone', { day: dayName(dayKey) }) });
  };

  return (
    <>
      {exercises.length === 0 && !day.cardio?.length && (
        <p className="text-sm text-subtle py-4 text-center">{t('plan.empty')}</p>
      )}

      {exercises.length > 0 && (
        <ul className="divide-y divide-line">
          {exercises.map((exercise, index) => {
            const itemId = `exercise:${exercise.id}`;
            const done = isItemDone(week, dayKey, itemId);
            return (
              <li key={exercise.id} className="flex items-center gap-3 py-2.5">
                <button
                  type="button"
                  onClick={() => setPreviewId(exercise.id)}
                  aria-label={`${t('plan.preview')}: ${exerciseName(exercise.name)}`}
                  className={`rounded-xl overflow-hidden border border-line flex-shrink-0 transition-opacity ${done ? 'opacity-50' : ''}`}
                >
                  <ExerciseImage name={exercise.name} className="w-16 h-16 sm:w-20 sm:h-20" />
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold leading-snug ${done ? 'line-through text-subtle' : ''}`}>
                    {exerciseName(exercise.name)}
                    {exercise.updated && (
                      <span className="ml-1.5 align-middle text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-primary-soft text-accent no-underline">
                        {t('plan.updated')}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted tabular-nums">{formatSets(exercise.sets)}</p>
                </div>
                <button
                  type="button"
                  data-tour={tour && index === 0 ? 'exercise-menu' : undefined}
                  onClick={() => setMenuId(exercise.id)}
                  aria-label={`${t('common.more')}: ${exerciseName(exercise.name)}`}
                  className="icon-btn flex-shrink-0"
                >
                  <MoreVertical size={19} />
                </button>
                <CheckButton checked={done} label={`${done ? t('plan.unmarkItem') : t('plan.markItem')}: ${exerciseName(exercise.name)}`} onToggle={() => toggle(itemId)} />
              </li>
            );
          })}
        </ul>
      )}

      {day.cardio && day.cardio.length > 0 && (
        <ul className="divide-y divide-line">
          {day.cardio.map((item, index) => {
            const itemId = `cardio:${index}`;
            const done = isItemDone(week, dayKey, itemId);
            const title = t(`cardio.${item.title}` as TranslationKey);
            return (
              <li key={itemId} className="flex items-center gap-3 py-2.5">
                <span className={`w-12 h-12 rounded-xl bg-primary-soft text-accent flex items-center justify-center flex-shrink-0 ${done ? 'opacity-50' : ''}`}>
                  <HeartPulse size={22} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${done ? 'line-through text-subtle' : ''}`}>{title}</p>
                  <p className="text-sm text-muted">{t(`cardio.${item.detail}` as TranslationKey)}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-surface-2 text-muted flex-shrink-0">
                  {t(`duration.${item.duration}` as TranslationKey)}
                </span>
                <CheckButton checked={done} label={`${done ? t('plan.unmarkItem') : t('plan.markItem')}: ${title}`} onToggle={() => toggle(itemId)} />
              </li>
            );
          })}
        </ul>
      )}

      {day.tipKey && (
        <p className="mt-2 flex gap-2 text-sm text-muted bg-surface-2 rounded-xl p-3">
          <Lightbulb size={17} className="text-accent flex-shrink-0 mt-0.5" />
          <span><strong className="text-ink">{t('tip.label')}:</strong> {t(`tip.${day.tipKey}` as TranslationKey)}</span>
        </p>
      )}

      {menuExercise && <ExerciseMenu day={day} exercise={menuExercise} onClose={() => setMenuId(null)} />}
      {previewExercise && (
        <ExercisePreview
          exercise={previewExercise}
          done={isItemDone(week, dayKey, `exercise:${previewExercise.id}`)}
          onToggle={() => toggle(`exercise:${previewExercise.id}`)}
          onSwap={() => { setPreviewId(null); setMenuId(previewExercise.id); }}
          onClose={() => setPreviewId(null)}
        />
      )}
    </>
  );
};

export default DayItems;
