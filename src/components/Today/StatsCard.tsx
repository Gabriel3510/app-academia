import React, { useMemo } from 'react';
import { CalendarCheck, Flame } from 'lucide-react';
import { usePreferences } from '../../contexts/preferences';
import { useWorkout } from '../../contexts/workout';
import { EMPTY_WEEK, getStreak, parseDateKey, shiftWeek, summarizeWeek } from '../../utils/week';

const WEEKS = 8;

const StatsCard: React.FC = () => {
  const { t, formatDate } = usePreferences();
  const { data, weekKey, activeGroup } = useWorkout();

  const { weeks, streak, total } = useMemo(() => {
    const keys = Array.from({ length: WEEKS }, (_, i) => shiftWeek(weekKey, i - WEEKS + 1));
    const summaries = keys.map((key) => summarizeWeek(data.progress[key] ?? EMPTY_WEEK, activeGroup, key));
    return {
      weeks: summaries,
      streak: getStreak(data.progress, activeGroup, weekKey),
      total: summaries.reduce((sum, week) => sum + week.done, 0),
    };
  }, [data.progress, activeGroup, weekKey]);

  const hasHistory = total > 0;

  return (
    <div data-tour="stats" className="card p-4 md:p-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-primary-soft p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-accent"><Flame size={15} /> {t('stats.streak')}</p>
          <p className="text-2xl font-bold tabular-nums mt-1">{t('stats.streakValue', { count: streak })}</p>
          <p className="text-[11px] text-muted leading-tight">{t('stats.streakHint')}</p>
        </div>
        <div className="rounded-xl bg-success-soft p-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-success"><CalendarCheck size={15} /> {t('stats.total')}</p>
          <p className="text-2xl font-bold tabular-nums mt-1">{total}</p>
          <p className="text-[11px] text-muted leading-tight">{t('stats.totalHint', { count: WEEKS })}</p>
        </div>
      </div>

      <h3 className="section-title mt-4 mb-2">{t('stats.history')}</h3>
      {hasHistory ? (
        <div className="flex items-end gap-1.5 h-24" role="list">
          {weeks.map((week) => {
            const ratio = week.planned ? Math.min(week.done / week.planned, 1) : 0;
            const current = week.weekKey === weekKey;
            const label = formatDate(parseDateKey(week.weekKey), { day: '2-digit', month: '2-digit' });
            return (
              <div
                key={week.weekKey}
                role="listitem"
                aria-label={`${t('stats.weekOf', { date: label })}: ${t('week.progress', { done: week.done, total: week.planned })}`}
                className="flex-1 min-w-0 h-full flex flex-col items-center gap-1"
              >
                <div className="w-full max-w-[32px] flex-1 rounded-md bg-surface-2 flex items-end overflow-hidden">
                  <div
                    className={`w-full rounded-md transition-all ${ratio >= 1 ? 'bg-success' : current ? 'bg-primary' : 'bg-primary/50'}`}
                    style={{ height: `${Math.max(ratio * 100, week.done ? 8 : 0)}%` }}
                  />
                </div>
                <span className={`text-[10px] tabular-nums ${current ? 'font-bold text-ink' : 'text-subtle'}`}>{label}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-subtle">{t('stats.historyEmpty')}</p>
      )}
    </div>
  );
};

export default StatsCard;
