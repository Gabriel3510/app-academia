import React, { useState } from 'react';
import { ArrowRight, BedDouble, PartyPopper } from 'lucide-react';
import { usePreferences } from '../../contexts/preferences';
import { useWorkout } from '../../contexts/workout';
import { DAY_KEYS } from '../../types';
import type { DayKey } from '../../types';
import { getDayCount, getTodayKey, isDayDone } from '../../utils/week';
import DayItems from '../Plan/DayItems';
import { FOCUS_ICONS } from '../UI/options';
import ProgressRing from '../UI/ProgressRing';

const TodayCard: React.FC<{ onOpenDay: (day: DayKey) => void }> = ({ onOpenDay }) => {
  const { t, dayName } = usePreferences();
  const { today, week, activeGroup, getDay } = useWorkout();
  const [trainAnyway, setTrainAnyway] = useState(false);
  const todayKey = getTodayKey(today);
  const isTrainingDay = todayKey !== null && (activeGroup.trainingDays.includes(todayKey) || trainAnyway);

  if (!todayKey || !isTrainingDay) {
    const todayIndex = todayKey ? DAY_KEYS.indexOf(todayKey) : DAY_KEYS.length;
    const next = DAY_KEYS.find((key, index) => index > todayIndex && activeGroup.trainingDays.includes(key) && !isDayDone(week, getDay(key)));
    return (
      <div data-tour="today" className="card p-4 md:p-5">
        <div className="flex items-start gap-3">
          <span className="w-12 h-12 rounded-2xl bg-surface-2 text-accent flex items-center justify-center flex-shrink-0"><BedDouble size={24} /></span>
          <div className="min-w-0">
            <p className="section-title">{todayKey ? dayName(todayKey) : t('today.weekend')}</p>
            <h2 className="text-lg font-bold">{t('today.restTitle')}</h2>
            <p className="text-sm text-muted">{t('today.restBody')}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {next ? (
            <button onClick={() => onOpenDay(next)} className="btn-secondary flex-1">
              {t('today.next', { day: dayName(next) })} <ArrowRight size={16} />
            </button>
          ) : (
            <p className="text-sm text-subtle">{t('today.noNext')}</p>
          )}
          {todayKey && (
            <button onClick={() => setTrainAnyway(true)} className="btn-primary flex-1">{t('today.restAnyway')}</button>
          )}
        </div>
      </div>
    );
  }

  const day = getDay(todayKey);
  const { done, total } = getDayCount(week, day);
  const complete = isDayDone(week, day);
  const Icon = FOCUS_ICONS[day.focusKey];

  return (
    <div data-tour="today" className="card p-4 md:p-5">
      <div className="flex items-center gap-4">
        <ProgressRing value={complete ? total : done} total={total} tone={complete ? 'success' : 'primary'}>
          {complete ? <PartyPopper size={24} className="text-success" /> : <Icon size={24} className="text-accent" />}
        </ProgressRing>
        <div className="flex-1 min-w-0">
          <p className="section-title">{t('today.title')} · {dayName(todayKey)}</p>
          <h2 className="text-lg font-bold leading-tight">{complete ? t('today.doneTitle') : t(`focus.${day.focusKey}`)}</h2>
          <p className="text-sm text-muted">{complete ? t('today.doneBody') : t('today.items', { done, total })}</p>
        </div>
      </div>
      <div className="mt-3">
        <DayItems dayKey={todayKey} />
      </div>
      <button onClick={() => onOpenDay(todayKey)} className="text-sm font-medium text-accent hover:underline mt-3 inline-flex items-center gap-1">
        {t('today.open')} <ArrowRight size={15} />
      </button>
    </div>
  );
};

export default TodayCard;
