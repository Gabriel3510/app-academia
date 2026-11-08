import { DAY_KEYS } from '../types';
import type { DayKey, DayStatus, PlanDay, WeekProgress, WorkoutGroup } from '../types';
import { dayItemIds } from './training';

const pad = (value: number) => String(value).padStart(2, '0');

export const toDateKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const parseDateKey = (key: string) => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day, 12);
};

export const getWeekStart = (date: Date) => {
  const start = new Date(date);
  start.setHours(12, 0, 0, 0);
  const weekday = start.getDay();
  start.setDate(start.getDate() + (weekday === 0 ? -6 : 1 - weekday));
  return start;
};

/** Monday of the week, as a local "YYYY-MM-DD" */
export const getWeekKey = (date: Date) => toDateKey(getWeekStart(date));

export const shiftWeek = (weekKey: string, weeks: number) => {
  const date = parseDateKey(weekKey);
  date.setDate(date.getDate() + weeks * 7);
  return toDateKey(date);
};

/** Calendar date of a weekday in the given week */
export const dayDateKey = (weekKey: string, day: DayKey) => {
  const date = parseDateKey(weekKey);
  date.setDate(date.getDate() + DAY_KEYS.indexOf(day));
  return toDateKey(date);
};

/** Training day for a date, or null on weekends */
export const getTodayKey = (date: Date): DayKey | null => DAY_KEYS[date.getDay() - 1] ?? null;

export const EMPTY_WEEK: WeekProgress = { days: [], items: [] };

export const itemKey = (dayKey: DayKey, itemId: string) => `${dayKey}:${itemId}`;

export const isItemDone = (week: WeekProgress, dayKey: DayKey, itemId: string) => week.items.includes(itemKey(dayKey, itemId));

export const getDayCount = (week: WeekProgress, day: PlanDay) => {
  const ids = dayItemIds(day);
  return { done: ids.filter((id) => isItemDone(week, day.key, id)).length, total: ids.length };
};

/** A day is done when marked by hand or when every item in it is checked */
export const isDayDone = (week: WeekProgress, day: PlanDay) => {
  if (week.days.includes(day.key)) return true;
  const { done, total } = getDayCount(week, day);
  return total > 0 && done === total;
};

/**
 * Status of a day in the week being shown. Past training days not done are missed;
 * on weekends the whole week is in the past. Days outside the schedule are rest unless done anyway.
 */
export const getDayStatus = (week: WeekProgress, day: PlanDay, group: WorkoutGroup, now: Date, weekKey: string, startedOn?: string): DayStatus => {
  if (isDayDone(week, day)) return 'done';
  if (!group.trainingDays.includes(day.key)) return 'rest';
  if (startedOn && dayDateKey(weekKey, day.key) < startedOn) return 'notStarted';
  const currentWeek = getWeekKey(now);
  if (weekKey < currentWeek) return 'missed';
  if (weekKey > currentWeek) return 'pending';
  const today = getTodayKey(now);
  const todayIndex = today ? DAY_KEYS.indexOf(today) : DAY_KEYS.length;
  return DAY_KEYS.indexOf(day.key) < todayIndex ? 'missed' : 'pending';
};

export interface WeekSummary {
  weekKey: string;
  done: number;
  planned: number;
}

export const summarizeWeek = (week: WeekProgress, group: WorkoutGroup, weekKey: string): WeekSummary => ({
  weekKey,
  done: group.plan.filter((day) => isDayDone(week, day)).length,
  planned: group.trainingDays.length,
});

/** Consecutive weeks, ending with the last complete one, in which every planned session was done */
export const getStreak = (history: Record<string, WeekProgress>, group: WorkoutGroup, currentWeek: string) => {
  const current = summarizeWeek(history[currentWeek] ?? EMPTY_WEEK, group, currentWeek);
  let streak = current.planned > 0 && current.done >= current.planned ? 1 : 0;
  let key = shiftWeek(currentWeek, -1);
  for (let i = 0; i < 104; i += 1) {
    const summary = summarizeWeek(history[key] ?? EMPTY_WEEK, group, key);
    if (summary.planned === 0 || summary.done < summary.planned) break;
    streak += 1;
    key = shiftWeek(key, -1);
  }
  return streak;
};
