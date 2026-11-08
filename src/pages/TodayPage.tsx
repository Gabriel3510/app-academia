import React, { useState } from 'react';
import { usePreferences } from '../contexts/preferences';
import { useWorkout } from '../contexts/workout';
import type { TranslationKey } from '../i18n/translations';
import type { DayKey } from '../types';
import TodayCard from '../components/Today/TodayCard';
import WeekCard from '../components/Today/WeekCard';
import StatsCard from '../components/Today/StatsCard';

const greetingKey = (hour: number): TranslationKey => {
  if (hour < 12) return 'greeting.morning';
  return hour < 18 ? 'greeting.afternoon' : 'greeting.evening';
};

const TodayPage: React.FC<{ onOpenDay: (day: DayKey) => void }> = ({ onOpenDay }) => {
  const { t, userName, formatDate } = usePreferences();
  const { today, activeGroup } = useWorkout();
  const [hour] = useState(() => new Date().getHours());
  const name = userName.trim();

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-hero text-on-hero -mx-4 -mt-4 md:mx-0 md:mt-0 md:rounded-2xl px-4 md:px-6 pt-3 md:pt-5 pb-14">
        <p className="text-2xl font-bold">{t(greetingKey(hour))}{name ? `, ${name}` : ''}!</p>
        <p className="text-sm opacity-75 first-letter:uppercase">
          {formatDate(today, { weekday: 'long', day: 'numeric', month: 'long' })} · {activeGroup.name}
        </p>
      </div>
      <div className="!-mt-10 md:mx-4 relative">
        <TodayCard onOpenDay={onOpenDay} />
      </div>
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <WeekCard />
        <StatsCard />
      </div>
    </div>
  );
};

export default TodayPage;
