import type { Preferences } from '../contexts/preferences';
import { BASE_PLAN, clonePlan } from '../data/basePlan';
import { isExerciseName } from '../data/exercises';
import { DAY_KEYS } from '../types';
import type {
  CardioItem, DayKey, Equipment, FocusKey, Level, Objective, PlanDay, PlanExercise, ProgressHistory,
  Sessions, SwapPolicy, WeekProgress, WorkoutData, WorkoutGroup,
} from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { SESSION_DAYS } from './training';
import { getWeekKey, parseDateKey } from './week';

export const DATA_KEY = 'academia-data-v2';
export const PREFS_KEY = 'academia-prefs-v2';

/** Keys written by version 1.x, read once to carry the data over */
const LEGACY = {
  groups: 'workout-groups-v1',
  activeGroup: 'workout-active-group-v1',
  choices: 'workout-exercise-choices-v1',
  collapsed: 'workout-collapsed-days-v1',
  onboarding: 'workout-onboarding-v1',
  language: 'workout-language',
  theme: 'workout-theme',
  progressPrefix: 'workout-progress-',
};

const HISTORY_WEEKS = 104;

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const oneOf = <T extends string | number>(value: unknown, options: readonly T[], fallback: T): T =>
  options.includes(value as T) ? (value as T) : fallback;
const isDayKey = (value: unknown): value is DayKey => DAY_KEYS.includes(value as DayKey);
const FOCUSES: FocusKey[] = ['cardio', 'push', 'pull', 'legs'];

export const normalizeSwapPolicy = (value: unknown) => oneOf<SwapPolicy>(value, ['strict', 'moderate', 'flexible'], 'moderate');
export const normalizeEquipment = (value: unknown) => oneOf<Equipment>(value, ['gym', 'home', 'mixed'], 'mixed');
export const normalizeLevel = (value: unknown) => oneOf<Level>(value, ['beginner', 'intermediate', 'advanced'], 'intermediate');
export const normalizeObjective = (value: unknown) => oneOf<Objective>(value, ['balanced', 'hypertrophy', 'fatloss', 'endurance'], 'balanced');
export const normalizeSessions = (value: unknown) => oneOf<Sessions>(Number(value), [3, 4, 5], 4);

const normalizeExercise = (raw: unknown): PlanExercise | null => {
  if (!isObject(raw) || typeof raw.id !== 'string' || !isExerciseName(raw.name) || typeof raw.sets !== 'string') return null;
  return {
    id: raw.id,
    slot: typeof raw.slot === 'string' ? raw.slot : raw.name,
    name: raw.name,
    sets: raw.sets,
    ...(raw.updated === true ? { updated: true } : {}),
  };
};

const normalizeCardio = (raw: unknown): CardioItem | null =>
  isObject(raw) && typeof raw.title === 'string' && typeof raw.detail === 'string' && typeof raw.duration === 'string'
    ? { title: raw.title, detail: raw.detail, duration: raw.duration }
    : null;

type ExerciseReader = (raw: unknown, index: number, day: DayKey) => PlanExercise | null;

const normalizeDay = (raw: unknown, exercise: ExerciseReader): PlanDay | null => {
  if (!isObject(raw) || !isDayKey(raw.key)) return null;
  const key = raw.key;
  const focusKey = oneOf<FocusKey>(raw.focusKey, FOCUSES, 'push');
  const day: PlanDay = { key, kind: oneOf<FocusKey>(raw.kind, FOCUSES, focusKey), focusKey };
  if (isDayKey(raw.tipKey)) day.tipKey = raw.tipKey;
  if (Array.isArray(raw.exercises)) {
    day.exercises = raw.exercises.map((item, index) => exercise(item, index, key)).filter((item): item is PlanExercise => item !== null);
  }
  if (Array.isArray(raw.cardio)) {
    day.cardio = raw.cardio.map(normalizeCardio).filter((item): item is CardioItem => item !== null);
  }
  return day;
};

/** Keeps the five weekdays in order, filling any missing one from the base plan */
const completePlan = (days: PlanDay[]): PlanDay[] => {
  const base = clonePlan(BASE_PLAN);
  return DAY_KEYS.map((key) => days.find((day) => day.key === key) ?? base.find((day) => day.key === key)!);
};

const normalizeGroup = (raw: unknown, exercise: ExerciseReader = normalizeExercise): WorkoutGroup | null => {
  if (!isObject(raw) || typeof raw.id !== 'string' || typeof raw.name !== 'string' || !Array.isArray(raw.plan)) return null;
  const days = raw.plan.map((day) => normalizeDay(day, exercise)).filter((day): day is PlanDay => day !== null);
  const trainingDays = Array.isArray(raw.trainingDays) ? DAY_KEYS.filter((key) => (raw.trainingDays as unknown[]).includes(key)) : [...DAY_KEYS];
  return {
    id: raw.id,
    name: raw.name.trim() || 'Plano',
    plan: completePlan(days),
    swapPolicy: normalizeSwapPolicy(raw.swapPolicy),
    equipmentProfile: normalizeEquipment(raw.equipmentProfile),
    levelProfile: normalizeLevel(raw.levelProfile),
    objectiveProfile: normalizeObjective(raw.objectiveProfile),
    trainingDays,
  };
};

const normalizeWeek = (raw: unknown): WeekProgress | null => {
  if (!isObject(raw)) return null;
  const days = Array.isArray(raw.days) ? DAY_KEYS.filter((key) => (raw.days as unknown[]).includes(key)) : [];
  const items = Array.isArray(raw.items) ? [...new Set(raw.items.filter((item): item is string => typeof item === 'string'))] : [];
  return days.length || items.length ? { days, items } : null;
};

const pruneHistory = (progress: ProgressHistory): ProgressHistory => {
  const keys = Object.keys(progress).sort().slice(-HISTORY_WEEKS);
  return Object.fromEntries(keys.map((key) => [key, progress[key]]));
};

export const createBaseGroup = (name: string): WorkoutGroup => ({
  id: 'base-group',
  name,
  plan: clonePlan(BASE_PLAN),
  swapPolicy: 'moderate',
  equipmentProfile: 'mixed',
  levelProfile: 'intermediate',
  objectiveProfile: 'balanced',
  trainingDays: [...DAY_KEYS],
});

/** Validates stored data and imported backups alike; anything that is not app data returns null */
export const normalizeWorkoutData = (raw: unknown): WorkoutData | null => {
  if (!isObject(raw) || !Array.isArray(raw.groups)) return null;
  const groups = raw.groups.map((group) => normalizeGroup(group)).filter((group): group is WorkoutGroup => group !== null);
  if (!groups.length) return null;
  const progress: ProgressHistory = {};
  if (isObject(raw.progress)) {
    for (const [key, value] of Object.entries(raw.progress)) {
      const week = normalizeWeek(value);
      if (/^\d{4}-\d{2}-\d{2}$/.test(key) && week) progress[key] = week;
    }
  }
  return {
    groups,
    activeGroupId: groups.some((group) => group.id === raw.activeGroupId) ? (raw.activeGroupId as string) : groups[0].id,
    collapsedDays: Array.isArray(raw.collapsedDays) ? DAY_KEYS.filter((key) => (raw.collapsedDays as unknown[]).includes(key)) : [],
    progress: pruneHistory(progress),
    ...(typeof raw.startedOn === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.startedOn) ? { startedOn: raw.startedOn } : {}),
  };
};

// ---------- Version 1.x migration ----------

const readJson = (key: string): unknown => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export interface LegacyPrefs {
  language?: 'pt-BR' | 'en';
  theme?: 'light' | 'dark';
  userName?: string;
  onboarded: boolean;
}

export const readLegacyPrefs = (): LegacyPrefs => {
  const language = localStorage.getItem(LEGACY.language);
  const theme = localStorage.getItem(LEGACY.theme);
  const onboarding = readJson(LEGACY.onboarding);
  return {
    language: language === 'pt' ? 'pt-BR' : language === 'en' ? 'en' : undefined,
    theme: theme === 'dark' || theme === 'light' ? theme : undefined,
    userName: isObject(onboarding) && typeof onboarding.name === 'string' ? onboarding.name.trim() : undefined,
    onboarded: isObject(onboarding),
  };
};

/** Version 1.x keyed week progress by a UTC date, which in time zones east of UTC fell on the Sunday before */
const legacyWeekToKey = (legacy: string) => {
  const date = parseDateKey(legacy);
  if (date.getDay() === 0) date.setDate(date.getDate() + 1);
  return getWeekKey(date);
};

/** True when version 1.x left workout groups behind, which the first-run setup must keep */
export const hasLegacyGroups = () => localStorage.getItem(LEGACY.groups) !== null;

export const readLegacyData = (): WorkoutData | null => {
  const rawGroups = readJson(LEGACY.groups);
  if (!Array.isArray(rawGroups)) return null;

  const choicesRaw = readJson(LEGACY.choices);
  const choices: Record<string, unknown> = isObject(choicesRaw) ? choicesRaw : {};
  const onboarding = readJson(LEGACY.onboarding);
  const trainingDays = isObject(onboarding) ? SESSION_DAYS[normalizeSessions(onboarding.sessionsWeekly)] : [...DAY_KEYS];
  const baseSlots = Object.fromEntries(BASE_PLAN.map((day) => [day.key, (day.exercises ?? []).map((exercise) => exercise.slot)]));

  // Exercises had no id; the slot came from "baseName" or the base plan position, and swaps lived in a separate map
  const legacyExercise = (raw: unknown, index: number, day: DayKey): PlanExercise | null => {
    if (!isObject(raw) || !isExerciseName(raw.name) || typeof raw.sets !== 'string') return null;
    const slot = typeof raw.baseName === 'string' && raw.baseName.trim() ? raw.baseName : baseSlots[day]?.[index] ?? raw.name;
    const choice = choices[`${day}:${slot}`];
    return {
      id: `${day}-${index}`,
      slot,
      name: isExerciseName(choice) ? choice : raw.name,
      sets: raw.sets,
      ...(raw.updated === true ? { updated: true } : {}),
    };
  };

  const groups = rawGroups
    .map((group) => normalizeGroup(isObject(group) ? { ...group, trainingDays } : group, legacyExercise))
    .filter((group): group is WorkoutGroup => group !== null);
  if (!groups.length) return null;

  const storedActive = localStorage.getItem(LEGACY.activeGroup);
  const activeGroupId = groups.some((group) => group.id === storedActive) ? storedActive! : groups[0].id;
  const activePlan = groups.find((group) => group.id === activeGroupId)!.plan;

  const progress: ProgressHistory = {};
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!key?.startsWith(LEGACY.progressPrefix)) continue;
    const legacyWeek = key.slice(LEGACY.progressPrefix.length);
    const raw = readJson(key);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(legacyWeek) || !isObject(raw)) continue;
    const week: WeekProgress = { days: [], items: [] };
    for (const [entry, value] of Object.entries(raw)) {
      if (value !== 'done') continue;
      const [kind, day, type, ...rest] = entry.split(':');
      if (kind === 'day' && isDayKey(day)) week.days.push(day);
      if (isDayKey(entry)) week.days.push(entry);
      if (kind !== 'item' || !isDayKey(day)) continue;
      if (type === 'cardio') week.items.push(`${day}:cardio:${rest[0]}`);
      if (type === 'exercise') {
        const exercise = activePlan.find((item) => item.key === day)?.exercises?.find((item) => item.slot === rest.join(':'));
        if (exercise) week.items.push(`${day}:exercise:${exercise.id}`);
      }
    }
    const normalized = normalizeWeek(week);
    if (normalized) progress[legacyWeekToKey(legacyWeek)] = normalized;
  }

  const collapsedRaw = readJson(LEGACY.collapsed);
  const collapsedDays = isObject(collapsedRaw) ? DAY_KEYS.filter((key) => collapsedRaw[key] === true) : [];

  return { groups, activeGroupId, collapsedDays, progress: pruneHistory(progress) };
};

// ---------- Preferences ----------

const detectLanguage = () => (navigator.language.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en');

export const createDefaultPreferences = (): Preferences => {
  const legacy = readLegacyPrefs();
  return {
    language: legacy.language ?? detectLanguage(),
    theme: legacy.theme ?? 'system',
    userName: legacy.userName ?? '',
    onboarded: legacy.onboarded,
  };
};

export const normalizePreferences = (raw: unknown): Preferences | null => {
  if (!isObject(raw)) return null;
  return {
    language: typeof raw.language === 'string' && raw.language in TRANSLATIONS ? (raw.language as Preferences['language']) : detectLanguage(),
    theme: raw.theme === 'light' || raw.theme === 'dark' ? raw.theme : 'system',
    userName: typeof raw.userName === 'string' ? raw.userName.slice(0, 40) : '',
    onboarded: raw.onboarded === true,
  };
};

// ---------- Backup ----------

const BACKUP_APP = 'app-academia';

export const createBackup = (data: WorkoutData, prefs: Preferences) =>
  JSON.stringify({ app: BACKUP_APP, version: 2, exportedAt: new Date().toISOString(), prefs, data }, null, 2);

/** Returns null for anything that is not a backup of this app, so a wrong file never touches the data */
export const parseBackup = (text: string): { data: WorkoutData; prefs: Preferences | null } | null => {
  try {
    const raw: unknown = JSON.parse(text);
    if (!isObject(raw) || raw.app !== BACKUP_APP) return null;
    const data = normalizeWorkoutData(raw.data);
    if (!data) return null;
    return { data, prefs: normalizePreferences(raw.prefs) };
  } catch {
    return null;
  }
};

/** Removes current and version 1.x keys alike, otherwise the next start would migrate the old data back */
export const eraseAllData = () => {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('academia-') || key.startsWith('workout-'))) keys.push(key);
  }
  keys.forEach((key) => localStorage.removeItem(key));
};
