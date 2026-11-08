import { BASE_PLAN, clonePlan } from '../data/basePlan';
import { exerciseInfo, LEVEL_RANK, VARIANTS } from '../data/exercises';
import type { ExerciseName, Family } from '../data/exercises';
import { DAY_KEYS } from '../types';
import type { DayKey, FocusKey, PlanDay, PlanExercise, Sessions, SwapPolicy, TrainingProfile, WorkoutGroup } from '../types';

const ALL_FAMILIES: Family[] = ['push', 'triceps', 'shoulders', 'core', 'pull', 'biceps', 'legs', 'posterior', 'calves', 'cardio'];

/** Muscle families each policy accepts as a swap on a day with the given focus */
const SWAP_RULES: Record<SwapPolicy, Record<FocusKey, Family[]>> = {
  strict: {
    push: ['push', 'triceps', 'shoulders'],
    pull: ['pull', 'biceps'],
    legs: ['legs', 'posterior', 'calves'],
    cardio: ['cardio', 'core'],
  },
  moderate: {
    push: ['push', 'triceps', 'shoulders', 'core'],
    pull: ['pull', 'biceps', 'shoulders', 'core'],
    legs: ['legs', 'posterior', 'calves', 'core'],
    cardio: ['cardio', 'core', 'legs'],
  },
  flexible: { push: ALL_FAMILIES, pull: ALL_FAMILIES, legs: ALL_FAMILIES, cardio: ALL_FAMILIES },
};

export const SESSION_DAYS: Record<Sessions, DayKey[]> = {
  3: ['monday', 'wednesday', 'friday'],
  4: ['monday', 'tuesday', 'thursday', 'friday'],
  5: [...DAY_KEYS],
};

type Filters = Pick<WorkoutGroup, 'swapPolicy' | 'equipmentProfile' | 'levelProfile' | 'objectiveProfile'>;

const fitsDay = (name: string, focus: FocusKey, policy: SwapPolicy) => {
  const families = exerciseInfo(name)?.families ?? [];
  if (!families.length) return true;
  const allowed = SWAP_RULES[policy][focus];
  return families.some((family) => allowed.includes(family));
};

const fitsEquipment = (name: string, filters: Filters) =>
  filters.equipmentProfile === 'mixed' || (exerciseInfo(name)?.equipment ?? ['home', 'gym']).includes(filters.equipmentProfile);

const fitsLevel = (name: string, filters: Filters) =>
  LEVEL_RANK[exerciseInfo(name)?.level ?? 'intermediate'] <= LEVEL_RANK[filters.levelProfile];

const fitsObjective = (name: string, filters: Filters) =>
  filters.objectiveProfile === 'balanced'
  || (exerciseInfo(name)?.objectives ?? ['hypertrophy', 'fatloss', 'endurance']).includes(filters.objectiveProfile);

const unique = (names: string[]) => [...new Set(names)];

/**
 * Swap options for an exercise. Filters are relaxed step by step (objective, then level)
 * so a slot always offers at least one alternative when one exists.
 */
export const getExerciseOptions = (day: PlanDay, exercise: PlanExercise, filters: Filters): string[] => {
  // Stable order, so the list does not reshuffle after every swap
  const options = unique([...(VARIANTS[exercise.slot as ExerciseName] ?? [exercise.slot]), exercise.name]);
  const passes: ((name: string) => boolean)[][] = [
    [(n) => fitsDay(n, day.focusKey, filters.swapPolicy), (n) => fitsEquipment(n, filters), (n) => fitsLevel(n, filters), (n) => fitsObjective(n, filters)],
    [(n) => fitsDay(n, day.focusKey, filters.swapPolicy), (n) => fitsEquipment(n, filters), (n) => fitsLevel(n, filters)],
    [(n) => fitsDay(n, day.focusKey, filters.swapPolicy), (n) => fitsEquipment(n, filters)],
  ];
  for (const checks of passes) {
    const filtered = options.filter((name) => name === exercise.name || checks.every((check) => check(name)));
    if (filtered.length > 1) return filtered;
  }
  return options;
};

type PlanFilters = Pick<TrainingProfile, 'objectiveProfile' | 'levelProfile' | 'equipmentProfile'>;

const chooseForProfile = (focus: FocusKey, slot: string, profile: PlanFilters): string => {
  const filters: Filters = {
    swapPolicy: 'moderate',
    objectiveProfile: profile.objectiveProfile,
    levelProfile: profile.levelProfile,
    equipmentProfile: profile.equipmentProfile,
  };
  const candidates = unique([slot, ...(VARIANTS[slot as ExerciseName] ?? [])]);
  const byEquipment = candidates.filter((name) => fitsEquipment(name, filters));
  const byObjective = byEquipment.filter((name) => fitsObjective(name, filters));
  const byDay = byObjective.filter((name) => fitsDay(name, focus, 'moderate'));
  return byDay[0] ?? byObjective[0] ?? byEquipment[0] ?? candidates[0];
};

const adjustSetsByLevel = (sets: string, level: TrainingProfile['levelProfile']) => {
  const match = sets.match(/^(\d+)\s*x\s*(.+)$/i);
  if (!match) return sets;
  const amount = Number(match[1]);
  if (level === 'beginner') return `${Math.max(2, amount - 1)} x ${match[2]}`;
  if (level === 'advanced') return `${amount + 1} x ${match[2]}`;
  return sets;
};

const adjustSetsByGoal = (sets: string, objective: TrainingProfile['objectiveProfile']) => {
  if (objective === 'fatloss' || objective === 'endurance') {
    return sets.replace('10-12', '12-15').replace('3 x 10', '3 x 12-15').replace('3 x 12', '3 x 15').replace('30-60s', '45-75s');
  }
  if (objective === 'hypertrophy') {
    return sets.replace('12-15', '8-12').replace('3 x 15', '4 x 10-12');
  }
  return sets;
};

export const buildPersonalizedPlan = (profile: PlanFilters): PlanDay[] => {
  const plan = clonePlan(BASE_PLAN);
  for (const day of plan) {
    if (!day.exercises) continue;
    for (const exercise of day.exercises) {
      exercise.name = chooseForProfile(day.focusKey, exercise.slot, profile);
      exercise.sets = adjustSetsByGoal(adjustSetsByLevel(exercise.sets, profile.levelProfile), profile.objectiveProfile);
    }
    const conditioning = profile.objectiveProfile === 'fatloss' || profile.objectiveProfile === 'endurance';
    if (conditioning && !day.exercises.some((exercise) => exercise.name === 'mountainClimber')) {
      day.exercises.push({
        id: `${day.key}-conditioning`,
        slot: 'mountainClimber',
        name: 'mountainClimber',
        sets: profile.objectiveProfile === 'endurance' ? '4 x 40s' : '3 x 30-45s',
      });
    }
  }
  return plan;
};

export type EfficiencyTone = 'excellent' | 'good' | 'adjust';

export interface Efficiency {
  score: number;
  tone: EfficiencyTone;
  counts: Record<FocusKey, number>;
  exerciseCount: number;
}

/** Scores how well a week balances push, pull, legs and cardio, and penalises the same heavy focus twice in a row */
export const getEfficiency = (plan: PlanDay[]): Efficiency => {
  const counts: Record<FocusKey, number> = { push: 0, pull: 0, legs: 0, cardio: 0 };
  let exerciseCount = 0;
  let repeated = 0;
  plan.forEach((day, index) => {
    counts[day.focusKey] += 1;
    exerciseCount += day.exercises?.length ?? 0;
    const previous = plan[index - 1];
    if (previous && previous.focusKey === day.focusKey && day.focusKey !== 'cardio') repeated += 8;
  });

  let score = 100;
  if (!counts.cardio) score -= 12;
  if (!counts.push || !counts.pull || !counts.legs) score -= 18;
  if (Math.abs(counts.push - counts.pull) > 1) score -= 8;
  if (exerciseCount < 14) score -= 10;
  if (exerciseCount > 34) score -= 10;
  score = Math.max(0, Math.min(100, score - repeated));

  const tone: EfficiencyTone = score >= 85 ? 'excellent' : score >= 70 ? 'good' : 'adjust';
  return { score, tone, counts, exerciseCount };
};

export const getExerciseFile = (name: string) => exerciseInfo(name)?.file ?? '';

export const dayItemIds = (day: PlanDay): string[] => [
  ...(day.exercises ?? []).map((exercise) => `exercise:${exercise.id}`),
  ...(day.cardio ?? []).map((_, index) => `cardio:${index}`),
];

export const createId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
