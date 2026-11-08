import { createContext, useContext } from 'react';
import type { DayKey, PlanDay, TrainingProfile, WeekProgress, WorkoutData, WorkoutGroup } from '../types';

export type GroupSettings = Partial<Pick<WorkoutGroup, 'name' | 'swapPolicy' | 'equipmentProfile' | 'levelProfile' | 'objectiveProfile' | 'trainingDays'>>;

export interface WorkoutContextType {
  data: WorkoutData;
  groups: WorkoutGroup[];
  activeGroup: WorkoutGroup;
  /** Today at noon; changes only when the date does */
  today: Date;
  weekKey: string;
  week: WeekProgress;

  getDay: (key: DayKey) => PlanDay;
  toggleItem: (day: DayKey, itemId: string) => void;
  /** Marks every item of the day, or clears them all when the day is already done */
  toggleDay: (day: DayKey) => void;
  resetWeek: () => WeekProgress;
  restoreWeek: (week: WeekProgress) => void;
  toggleCollapsed: (day: DayKey) => void;

  swapExercise: (day: DayKey, exerciseId: string, name: string) => void;
  moveExercise: (from: DayKey, exerciseId: string, to: DayKey) => void;
  reorderExercise: (day: DayKey, exerciseId: string, offset: -1 | 1) => void;

  setActiveGroup: (id: string) => void;
  createGroup: (name: string) => void;
  duplicateGroup: (id: string, name: string) => void;
  updateGroup: (id: string, settings: GroupSettings) => void;
  regeneratePlan: (id: string) => void;
  deleteGroup: (id: string) => void;
  createFromProfile: (profile: TrainingProfile, name: string, replaceAll: boolean) => void;

  replaceData: (data: WorkoutData) => void;
}

export const WorkoutContext = createContext<WorkoutContextType | null>(null);

export const useWorkout = (): WorkoutContextType => {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error('useWorkout must be used within WorkoutProvider');
  return ctx;
};
