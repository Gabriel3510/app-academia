import type { PlanDay, PlanExercise } from '../types';
import type { ExerciseName } from './exercises';

const ex = (id: string, name: ExerciseName, sets: string, updated?: boolean): PlanExercise => ({
  id, slot: name, name, sets, ...(updated ? { updated } : {}),
});

export const BASE_PLAN: PlanDay[] = [
  {
    key: 'monday',
    kind: 'cardio',
    focusKey: 'cardio',
    tipKey: 'monday',
    cardio: [
      { title: 'treadmill', detail: 'treadmillDetailMon', duration: 'fortyFive' },
      { title: 'intervals', detail: 'intervalsDetail', duration: 'optional' },
    ],
  },
  {
    key: 'tuesday',
    kind: 'push',
    focusKey: 'push',
    tipKey: 'tuesday',
    exercises: [
      ex('tuesday-0', 'benchPress', '3 x 10-12'),
      ex('tuesday-1', 'machineFly', '3 x 12'),
      ex('tuesday-2', 'tricepsPushdown', '3 x 12'),
      ex('tuesday-3', 'lyingTricepsExtension', '3 x 10', true),
      ex('tuesday-4', 'plank', '3 x 30-60s'),
      ex('tuesday-5', 'crunch', '3 x 15'),
    ],
  },
  {
    key: 'wednesday',
    kind: 'pull',
    focusKey: 'pull',
    exercises: [
      ex('wednesday-0', 'latPulldown', '3 x 10-12'),
      ex('wednesday-1', 'seatedRow', '3 x 12'),
      ex('wednesday-2', 'dumbbellCurl', '3 x 12'),
      ex('wednesday-3', 'barbellCurl', '3 x 10'),
      ex('wednesday-4', 'legRaise', '3 x 12'),
      ex('wednesday-5', 'sidePlank', '3 x 30s each'),
    ],
  },
  {
    key: 'thursday',
    kind: 'legs',
    focusKey: 'legs',
    tipKey: 'thursday',
    exercises: [
      ex('thursday-0', 'gobletSquat', '3 x 10-12', true),
      ex('thursday-1', 'legPress', '3 x 12'),
      ex('thursday-2', 'legExtension', '3 x 12'),
      ex('thursday-3', 'lateralRaise', '3 x 12'),
      ex('thursday-4', 'shoulderPress', '3 x 10'),
    ],
  },
  {
    key: 'friday',
    kind: 'cardio',
    focusKey: 'cardio',
    tipKey: 'friday',
    cardio: [
      { title: 'treadmill', detail: 'treadmillDetailFri', duration: 'fortyFive' },
      { title: 'altCardio', detail: 'altCardioDetail', duration: 'variable' },
    ],
  },
];

export const clonePlan = (plan: PlanDay[]): PlanDay[] => structuredClone(plan);
