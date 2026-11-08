import React from 'react';
import { usePreferences } from '../../contexts/preferences';
import type { PlanDay } from '../../types';
import { getEfficiency } from '../../utils/training';
import type { EfficiencyTone } from '../../utils/training';
import { FOCUS_ICONS } from '../UI/options';

const TONES: Record<EfficiencyTone, { bar: string; text: string }> = {
  excellent: { bar: 'bg-success', text: 'text-success' },
  good: { bar: 'bg-primary', text: 'text-accent' },
  adjust: { bar: 'bg-warning', text: 'text-warning' },
};

const EfficiencyCard: React.FC<{ plan: PlanDay[] }> = ({ plan }) => {
  const { t } = usePreferences();
  const { score, tone, counts, exerciseCount } = getEfficiency(plan);

  return (
    <div data-tour="efficiency" className="card p-4 md:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-semibold">{t('efficiency.title')}</h2>
        <p className={`text-2xl font-bold tabular-nums ${TONES[tone].text}`}>{score}<span className="text-sm text-subtle font-medium">/100</span></p>
      </div>
      <div className="w-full bg-surface-2 rounded-full h-2.5 my-2">
        <div className={`h-2.5 rounded-full transition-all duration-500 ${TONES[tone].bar}`} style={{ width: `${score}%` }} />
      </div>
      <p className={`text-sm font-semibold ${TONES[tone].text}`}>{t(`efficiency.${tone}`)}</p>
      <p className="text-sm text-muted">{t(`efficiency.${tone}.hint`)}</p>
      <div className="flex flex-wrap gap-2 mt-3">
        {(Object.keys(counts) as (keyof typeof counts)[]).map((focus) => {
          const Icon = FOCUS_ICONS[focus];
          return (
            <span key={focus} className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-surface-2 text-muted">
              <Icon size={14} className="text-accent" /> {t(`focus.${focus}`)} × {counts[focus]}
            </span>
          );
        })}
        <span className="inline-flex items-center text-xs font-medium px-2.5 py-1.5 rounded-lg bg-surface-2 text-muted">
          {t('efficiency.exercises', { count: exerciseCount })}
        </span>
      </div>
    </div>
  );
};

export default EfficiencyCard;
