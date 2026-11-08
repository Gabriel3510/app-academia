import React, { useState } from 'react';
import { Check, Minus, Moon, RotateCcw, X } from 'lucide-react';
import { usePreferences } from '../../contexts/preferences';
import { useToast } from '../../contexts/toast';
import { useWorkout } from '../../contexts/workout';
import { DAY_KEYS } from '../../types';
import type { DayStatus } from '../../types';
import { getDayStatus, getTodayKey, summarizeWeek } from '../../utils/week';
import { STATUS_STYLES } from '../Plan/statusStyles';
import ConfirmDialog from '../UI/ConfirmDialog';

const STATUS_ICON: Record<DayStatus, React.ReactNode> = {
  done: <Check size={18} strokeWidth={3} />,
  missed: <X size={18} strokeWidth={3} />,
  pending: <span className="w-2 h-2 rounded-full bg-current" />,
  rest: <Moon size={16} />,
  notStarted: <Minus size={16} />,
};

const WeekCard: React.FC = () => {
  const { t, dayName } = usePreferences();
  const { data, week, weekKey, today, activeGroup, toggleDay, resetWeek, restoreWeek } = useWorkout();
  const { showToast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const todayKey = getTodayKey(today);
  const { done, planned } = summarizeWeek(week, activeGroup, weekKey);
  const pct = planned ? Math.min(done / planned, 1) * 100 : 0;

  const reset = () => {
    const previous = resetWeek();
    showToast({ kind: 'info', message: t('week.resetDone'), actionLabel: t('common.undo'), onAction: () => restoreWeek(previous) });
  };

  return (
    <div data-tour="week" className="card p-4 md:p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold">{t('week.title')}</h2>
          <p className="text-sm text-muted">{done >= planned && planned > 0 ? t('week.allDone') : t('week.progress', { done, total: planned })}</p>
        </div>
        <button onClick={() => setConfirming(true)} disabled={!week.days.length && !week.items.length} aria-label={t('week.reset')} title={t('week.reset')} className="icon-btn -mr-2 -mt-1">
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="w-full bg-surface-2 rounded-full h-2.5 my-3">
        <div className={`h-2.5 rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-success' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
      </div>

      <div className="grid grid-cols-5 gap-2">
        {DAY_KEYS.map((key) => {
          const day = activeGroup.plan.find((item) => item.key === key)!;
          const status = getDayStatus(week, day, activeGroup, today, weekKey, data.startedOn);
          return (
            <button
              key={key}
              onClick={() => toggleDay(key)}
              aria-label={`${dayName(key)}: ${t(`status.${status}`)}`}
              className="flex flex-col items-center gap-1.5 py-1 rounded-xl hover:bg-surface-2 transition-colors"
            >
              <span className={`w-10 h-10 rounded-full flex items-center justify-center ${STATUS_STYLES[status]} ${key === todayKey ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : ''}`}>
                {STATUS_ICON[status]}
              </span>
              <span className={`text-xs ${key === todayKey ? 'font-bold text-ink' : 'text-subtle'}`}>{t(`dayShort.${key}`)}</span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-subtle mt-2 text-center">{t('week.hint')}</p>

      {confirming && (
        <ConfirmDialog
          title={t('week.resetTitle')}
          body={t('week.resetBody')}
          confirmLabel={t('week.reset')}
          onConfirm={reset}
          onClose={() => setConfirming(false)}
        />
      )}
    </div>
  );
};

export default WeekCard;
