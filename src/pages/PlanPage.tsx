import React, { useEffect } from 'react';
import { usePreferences } from '../contexts/preferences';
import { useWorkout } from '../contexts/workout';
import { DAY_KEYS } from '../types';
import type { DayKey } from '../types';
import DayCard from '../components/Plan/DayCard';

const PlanPage: React.FC<{ focusDay: DayKey | null }> = ({ focusDay }) => {
  const { t } = usePreferences();
  const { activeGroup } = useWorkout();
  // The tour points at the first day that has exercises to show the exercise menu
  const tourDay = activeGroup.plan.find((day) => day.exercises?.length)?.key;

  useEffect(() => {
    if (focusDay) document.getElementById(`day-${focusDay}`)?.scrollIntoView({ block: 'start' });
  }, [focusDay]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        {t('plan.subtitle', { name: activeGroup.name, count: activeGroup.trainingDays.length })}
      </p>
      <div className="grid gap-4 lg:grid-cols-2 items-start">
        {DAY_KEYS.map((key) => <DayCard key={key} dayKey={key} tour={key === tourDay} />)}
      </div>
    </div>
  );
};

export default PlanPage;
