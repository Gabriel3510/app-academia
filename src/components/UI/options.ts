import {
  BicepsFlexed, Building2, CalendarDays, Dumbbell, Flame, Footprints, HeartPulse, House, Mountain, Scale, Shuffle,
  Sprout, TrendingUp,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TranslateFn } from '../../contexts/preferences';
import type { Equipment, FocusKey, Level, Objective, Sessions, SwapPolicy } from '../../types';
import type { OptionCard } from './OptionCards';

export const FOCUS_ICONS: Record<FocusKey, LucideIcon> = {
  cardio: HeartPulse,
  push: Dumbbell,
  pull: BicepsFlexed,
  legs: Footprints,
};

export const objectiveOptions = (t: TranslateFn): OptionCard<Objective>[] => [
  { value: 'balanced', label: t('objective.balanced'), hint: t('objective.balanced.hint'), icon: Scale },
  { value: 'hypertrophy', label: t('objective.hypertrophy'), hint: t('objective.hypertrophy.hint'), icon: Dumbbell },
  { value: 'fatloss', label: t('objective.fatloss'), hint: t('objective.fatloss.hint'), icon: Flame },
  { value: 'endurance', label: t('objective.endurance'), hint: t('objective.endurance.hint'), icon: HeartPulse },
];

export const levelOptions = (t: TranslateFn): OptionCard<Level>[] => [
  { value: 'beginner', label: t('level.beginner'), hint: t('level.beginner.hint'), icon: Sprout },
  { value: 'intermediate', label: t('level.intermediate'), hint: t('level.intermediate.hint'), icon: TrendingUp },
  { value: 'advanced', label: t('level.advanced'), hint: t('level.advanced.hint'), icon: Mountain },
];

export const equipmentOptions = (t: TranslateFn): OptionCard<Equipment>[] => [
  { value: 'gym', label: t('equipment.gym'), hint: t('equipment.gym.hint'), icon: Building2 },
  { value: 'home', label: t('equipment.home'), hint: t('equipment.home.hint'), icon: House },
  { value: 'mixed', label: t('equipment.mixed'), hint: t('equipment.mixed.hint'), icon: Shuffle },
];

export const sessionOptions = (t: TranslateFn): OptionCard<Sessions>[] => ([3, 4, 5] as const).map((count) => ({
  value: count,
  label: t('sessions.value', { count }),
  hint: t(`sessions.${count}.hint`),
  icon: CalendarDays,
}));

export const policyOptions = (t: TranslateFn): { value: SwapPolicy; label: string }[] => [
  { value: 'strict', label: t('policy.strict') },
  { value: 'moderate', label: t('policy.moderate') },
  { value: 'flexible', label: t('policy.flexible') },
];

/** Plain value and label pairs for the compact Select */
export const asSelect = <T extends string | number>(options: { value: T; label: string }[]) =>
  options.map(({ value, label }) => ({ value: String(value), label }));
