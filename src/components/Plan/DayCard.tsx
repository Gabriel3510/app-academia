import React from 'react';
import { CheckCheck, ChevronDown, RotateCcw } from 'lucide-react';
import { usePreferences } from '../../contexts/preferences';
import { useWorkout } from '../../contexts/workout';
import type { DayKey } from '../../types';
import { getDayCount, getDayStatus, getTodayKey } from '../../utils/week';
import { FOCUS_ICONS } from '../UI/options';
import DayItems from './DayItems';
import StatusBadge from './StatusBadge';

interface DayCardProps {
  dayKey: DayKey;
  tour?: boolean;
}

const DayCard: React.FC<DayCardProps> = ({ dayKey, tour }) => {
  const { t, dayName } = usePreferences();
  const { week, weekKey, today, activeGroup, getDay, toggleDay, toggleCollapsed, data } = useWorkout();
  const day = getDay(dayKey);
  const status = getDayStatus(week, day, activeGroup, today, weekKey, data.startedOn);
  const { done, total } = getDayCount(week, day);
  const collapsed = data.collapsedDays.includes(dayKey);
  const isToday = getTodayKey(today) === dayKey;
  const Icon = FOCUS_ICONS[day.focusKey];
  const contentId = `day-${dayKey}-content`;

  return (
    <section
      id={`day-${dayKey}`}
      data-tour={tour ? 'day-card' : undefined}
      className={`card overflow-hidden scroll-mt-20 ${isToday ? 'ring-2 ring-primary' : ''}`}
    >
      <button
        type="button"
        onClick={() => toggleCollapsed(dayKey)}
        aria-expanded={!collapsed}
        aria-controls={contentId}
        aria-label={`${dayName(dayKey)}: ${collapsed ? t('plan.expand') : t('plan.collapse')}`}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-2/60 transition-colors"
      >
        <span className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${status === 'done' ? 'bg-success-soft text-success' : 'bg-primary-soft text-accent'}`}>
          <Icon size={22} />
        </span>
        <span className="flex-1 min-w-0">
          <span className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">{dayName(dayKey)}</span>
            <StatusBadge status={status} />
          </span>
          <span className="block text-sm text-muted truncate">
            {t(`focus.${day.focusKey}`)} · {done}/{total}
          </span>
        </span>
        <ChevronDown size={20} className={`text-subtle flex-shrink-0 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
      </button>

      <div className="h-1 bg-surface-2" aria-hidden="true">
        <div className={`h-1 transition-all duration-300 ${status === 'done' ? 'bg-success' : 'bg-primary'}`} style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
      </div>

      {!collapsed && (
        <div id={contentId} className="px-4 pb-4 pt-1">
          {status === 'rest' && <p className="text-xs text-subtle pt-2">{t('plan.restDay')}</p>}
          <DayItems dayKey={dayKey} tour={tour} />
          <button
            type="button"
            onClick={() => toggleDay(dayKey)}
            className={`w-full mt-3 ${status === 'done' ? 'btn-secondary' : 'btn-primary'}`}
          >
            {status === 'done' ? <><RotateCcw size={16} /> {t('plan.unmarkDay')}</> : <><CheckCheck size={16} /> {t('plan.markDay')}</>}
          </button>
        </div>
      )}
    </section>
  );
};

export default DayCard;
