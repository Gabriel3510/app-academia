export type Language = 'pt-BR' | 'en';
export type ThemeMode = 'light' | 'dark' | 'system';
export type Page = 'today' | 'plan' | 'profiles' | 'settings';

export const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;
export type DayKey = typeof DAY_KEYS[number];

export type FocusKey = 'cardio' | 'push' | 'pull' | 'legs';
export type SwapPolicy = 'strict' | 'moderate' | 'flexible';
export type Equipment = 'gym' | 'home' | 'mixed';
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Objective = 'balanced' | 'hypertrophy' | 'fatloss' | 'endurance';
export type Sessions = 3 | 4 | 5;

export interface PlanExercise {
  /** Stable id, used for progress so two copies of the same exercise never share a check mark */
  id: string;
  /** Exercise that defines the slot; its variants are the swap options */
  slot: string;
  /** Exercise currently shown in the slot */
  name: string;
  sets: string;
  updated?: boolean;
}

export interface CardioItem {
  title: string;
  detail: string;
  duration: string;
}

export interface PlanDay {
  key: DayKey;
  kind: FocusKey;
  focusKey: FocusKey;
  tipKey?: DayKey;
  exercises?: PlanExercise[];
  cardio?: CardioItem[];
}

export interface WorkoutGroup {
  id: string;
  name: string;
  plan: PlanDay[];
  swapPolicy: SwapPolicy;
  equipmentProfile: Equipment;
  levelProfile: Level;
  objectiveProfile: Objective;
  trainingDays: DayKey[];
}

export interface TrainingProfile {
  objectiveProfile: Objective;
  levelProfile: Level;
  equipmentProfile: Equipment;
  sessionsWeekly: Sessions;
}

/** Progress of one week: days marked done by hand and completed item ids ("day:itemId") */
export interface WeekProgress {
  days: DayKey[];
  items: string[];
}

export type ProgressHistory = Record<string, WeekProgress>;

export interface WorkoutData {
  groups: WorkoutGroup[];
  activeGroupId: string;
  collapsedDays: DayKey[];
  progress: ProgressHistory;
  /** First day the plan was used ("YYYY-MM-DD"); earlier days are never counted as missed */
  startedOn?: string;
}

export type DayStatus = 'done' | 'missed' | 'pending' | 'rest' | 'notStarted';
