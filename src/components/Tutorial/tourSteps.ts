import type { TranslationKey } from '../../i18n/translations';
import type { Page } from '../../types';

export interface TourStep {
  page: Page;
  target: string;
  title: TranslationKey;
  body: TranslationKey;
}

export const TOUR_STEPS: TourStep[] = [
  { page: 'today', target: 'today', title: 'tour.today.title', body: 'tour.today.body' },
  { page: 'today', target: 'week', title: 'tour.week.title', body: 'tour.week.body' },
  { page: 'today', target: 'stats', title: 'tour.stats.title', body: 'tour.stats.body' },
  { page: 'plan', target: 'day-card', title: 'tour.plan.title', body: 'tour.plan.body' },
  { page: 'plan', target: 'exercise-menu', title: 'tour.exercise.title', body: 'tour.exercise.body' },
  { page: 'profiles', target: 'profiles', title: 'tour.profiles.title', body: 'tour.profiles.body' },
  { page: 'settings', target: 'settings-data', title: 'tour.data.title', body: 'tour.data.body' },
];
