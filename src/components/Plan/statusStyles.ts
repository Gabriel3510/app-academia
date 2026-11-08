import type { DayStatus } from '../../types';

export const STATUS_STYLES: Record<DayStatus, string> = {
  done: 'bg-success-soft text-success',
  missed: 'bg-danger-soft text-danger',
  pending: 'bg-warning-soft text-warning',
  rest: 'bg-surface-2 text-subtle',
  notStarted: 'bg-surface-2 text-subtle',
};
