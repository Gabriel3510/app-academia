import React, { useCallback, useMemo } from 'react';
import { BASE_PLAN } from '../data/basePlan';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNow } from '../hooks/useNow';
import type { DayKey, PlanDay, TrainingProfile, WeekProgress, WorkoutData, WorkoutGroup } from '../types';
import { createBaseGroup, DATA_KEY, normalizeWorkoutData, readLegacyData } from '../utils/storage';
import { buildPersonalizedPlan, createId, dayItemIds, SESSION_DAYS } from '../utils/training';
import { EMPTY_WEEK, getWeekKey, isDayDone, itemKey, parseDateKey, toDateKey } from '../utils/week';
import { usePreferences } from './preferences';
import { WorkoutContext } from './workout';
import type { GroupSettings, WorkoutContextType } from './workout';

const without = <T,>(list: T[], value: T) => list.filter((item) => item !== value);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = usePreferences();
  const createInitial = useCallback((): WorkoutData => readLegacyData() ?? {
    groups: [createBaseGroup(t('profiles.defaultName'))],
    activeGroupId: 'base-group',
    collapsedDays: [],
    progress: {},
    startedOn: toDateKey(new Date()),
  }, [t]);
  const [data, setData] = useLocalStorage<WorkoutData>(DATA_KEY, createInitial, normalizeWorkoutData);

  const now = useNow();
  const dateKey = toDateKey(now);
  const today = useMemo(() => parseDateKey(dateKey), [dateKey]);
  const weekKey = getWeekKey(today);
  const week = data.progress[weekKey] ?? EMPTY_WEEK;
  const activeGroup = data.groups.find((group) => group.id === data.activeGroupId) ?? data.groups[0];

  const value = useMemo<WorkoutContextType>(() => {
    const getDay = (key: DayKey): PlanDay => activeGroup.plan.find((day) => day.key === key)!;

    const updateWeek = (update: (week: WeekProgress) => WeekProgress) =>
      setData((prev) => ({ ...prev, progress: { ...prev.progress, [weekKey]: update(prev.progress[weekKey] ?? EMPTY_WEEK) } }));

    const updateGroupById = (id: string, update: (group: WorkoutGroup) => WorkoutGroup) =>
      setData((prev) => ({ ...prev, groups: prev.groups.map((group) => (group.id === id ? update(group) : group)) }));

    const updateActivePlan = (update: (plan: PlanDay[]) => PlanDay[]) =>
      updateGroupById(activeGroup.id, (group) => ({ ...group, plan: update(group.plan) }));

    const addGroup = (group: WorkoutGroup) =>
      setData((prev) => ({ ...prev, groups: [...prev.groups, group], activeGroupId: group.id }));

    return {
      data,
      groups: data.groups,
      activeGroup,
      today,
      weekKey,
      week,
      getDay,

      toggleItem: (day, itemId) => updateWeek((current) => {
        const key = itemKey(day, itemId);
        const checked = current.items.includes(key);
        // Unchecking an item reopens a day that had been closed by hand
        return checked
          ? { days: without(current.days, day), items: without(current.items, key) }
          : { ...current, items: [...current.items, key] };
      }),

      toggleDay: (dayKey) => updateWeek((current) => {
        const day = getDay(dayKey);
        const keys = dayItemIds(day).map((id) => itemKey(dayKey, id));
        if (isDayDone(current, day)) {
          return { days: without(current.days, dayKey), items: current.items.filter((key) => !keys.includes(key)) };
        }
        return { days: [...current.days, dayKey], items: [...new Set([...current.items, ...keys])] };
      }),

      resetWeek: () => {
        updateWeek(() => EMPTY_WEEK);
        return week;
      },
      restoreWeek: (previous) => updateWeek(() => previous),

      toggleCollapsed: (day) => setData((prev) => ({
        ...prev,
        collapsedDays: prev.collapsedDays.includes(day) ? without(prev.collapsedDays, day) : [...prev.collapsedDays, day],
      })),

      swapExercise: (dayKey, exerciseId, name) => updateActivePlan((plan) => plan.map((day) => (
        day.key !== dayKey ? day : {
          ...day,
          exercises: day.exercises?.map((exercise) => (exercise.id === exerciseId ? { ...exercise, name, updated: undefined } : exercise)),
        }
      ))),

      moveExercise: (from, exerciseId, to) => {
        const moving = getDay(from).exercises?.find((exercise) => exercise.id === exerciseId);
        if (!moving || from === to) return;
        updateActivePlan((plan) => plan.map((day) => {
          if (day.key === from) return { ...day, exercises: day.exercises?.filter((exercise) => exercise.id !== exerciseId) };
          if (day.key === to) return { ...day, exercises: [...(day.exercises ?? []), moving] };
          return day;
        }));
        // A check mark belongs to the day it was made on
        updateWeek((current) => ({ ...current, items: without(current.items, itemKey(from, `exercise:${exerciseId}`)) }));
      },

      reorderExercise: (dayKey, exerciseId, offset) => updateActivePlan((plan) => plan.map((day) => {
        if (day.key !== dayKey || !day.exercises) return day;
        const index = day.exercises.findIndex((exercise) => exercise.id === exerciseId);
        const target = index + offset;
        if (index < 0 || target < 0 || target >= day.exercises.length) return day;
        const exercises = [...day.exercises];
        [exercises[index], exercises[target]] = [exercises[target], exercises[index]];
        return { ...day, exercises };
      })),

      setActiveGroup: (id) => setData((prev) => ({ ...prev, activeGroupId: id })),

      createGroup: (name) => addGroup({ ...createBaseGroup(name), id: createId('group') }),

      duplicateGroup: (id, name) => {
        const source = data.groups.find((group) => group.id === id);
        if (source) addGroup({ ...structuredClone(source), id: createId('group'), name });
      },

      updateGroup: (id, settings: GroupSettings) => updateGroupById(id, (group) => ({ ...group, ...settings })),

      regeneratePlan: (id) => updateGroupById(id, (group) => ({ ...group, plan: buildPersonalizedPlan(group) })),

      deleteGroup: (id) => setData((prev) => {
        if (prev.groups.length <= 1) return prev;
        const groups = prev.groups.filter((group) => group.id !== id);
        return { ...prev, groups, activeGroupId: prev.activeGroupId === id ? groups[0].id : prev.activeGroupId };
      }),

      createFromProfile: (profile: TrainingProfile, name, replaceAll) => {
        const group: WorkoutGroup = {
          id: createId('group'),
          name,
          plan: buildPersonalizedPlan(profile),
          swapPolicy: 'moderate',
          equipmentProfile: profile.equipmentProfile,
          levelProfile: profile.levelProfile,
          objectiveProfile: profile.objectiveProfile,
          trainingDays: SESSION_DAYS[profile.sessionsWeekly],
        };
        setData((prev) => ({
          ...prev,
          groups: replaceAll ? [group] : [...prev.groups, group],
          activeGroupId: group.id,
          ...(replaceAll ? { startedOn: toDateKey(new Date()) } : {}),
          // Rest days start folded so the week shows what matters
          collapsedDays: BASE_PLAN.map((day) => day.key).filter((key) => !group.trainingDays.includes(key)),
        }));
      },

      replaceData: (next) => setData(next),
    };
  }, [data, activeGroup, today, weekKey, week, setData]);

  return <WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>;
};
