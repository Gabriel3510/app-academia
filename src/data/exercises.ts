import type { Equipment, Level, Objective } from '../types';

export type Family = 'push' | 'triceps' | 'shoulders' | 'pull' | 'biceps' | 'legs' | 'posterior' | 'calves' | 'core' | 'cardio';

interface ExerciseInfo {
  file: string;
  families: Family[];
  equipment: Exclude<Equipment, 'mixed'>[];
  level: Level;
  objectives: Exclude<Objective, 'balanced'>[];
}

const BOTH: ExerciseInfo['equipment'] = ['home', 'gym'];
const GYM: ExerciseInfo['equipment'] = ['gym'];
const LIGHT: ExerciseInfo['objectives'] = ['fatloss', 'endurance'];

export const EXERCISES = {
  benchPress: { file: 'supino.gif', families: ['push'], equipment: GYM, level: 'intermediate', objectives: ['hypertrophy'] },
  inclineBenchPress: { file: 'supino-inclinado.gif', families: ['push'], equipment: GYM, level: 'intermediate', objectives: ['hypertrophy'] },
  machineFly: { file: 'crucifixo.gif', families: ['push'], equipment: GYM, level: 'beginner', objectives: ['hypertrophy'] },
  pecDeck: { file: 'peck-deck.gif', families: ['push'], equipment: GYM, level: 'beginner', objectives: ['hypertrophy'] },
  cableCrossover: { file: 'crossover-cabo.gif', families: ['push'], equipment: GYM, level: 'intermediate', objectives: ['hypertrophy'] },
  pushUps: { file: 'flexao.gif', families: ['push'], equipment: BOTH, level: 'beginner', objectives: LIGHT },
  chestDip: { file: 'mergulho-paralela.gif', families: ['push', 'triceps'], equipment: BOTH, level: 'advanced', objectives: ['hypertrophy', 'endurance'] },
  tricepsPushdown: { file: 'triceps-polia.gif', families: ['triceps', 'push'], equipment: GYM, level: 'beginner', objectives: ['hypertrophy'] },
  lyingTricepsExtension: { file: 'triceps-frances.gif', families: ['triceps', 'push'], equipment: BOTH, level: 'intermediate', objectives: ['hypertrophy'] },
  overheadTricepsExtension: { file: 'triceps-overhead.gif', families: ['triceps', 'push'], equipment: BOTH, level: 'intermediate', objectives: ['hypertrophy'] },

  latPulldown: { file: 'puxada.gif', families: ['pull'], equipment: GYM, level: 'beginner', objectives: ['hypertrophy'] },
  seatedRow: { file: 'remada.gif', families: ['pull'], equipment: GYM, level: 'beginner', objectives: ['hypertrophy'] },
  oneArmDumbbellRow: { file: 'remada-unilateral.gif', families: ['pull'], equipment: BOTH, level: 'intermediate', objectives: ['hypertrophy'] },
  assistedPullUp: { file: 'barra-assistida.gif', families: ['pull'], equipment: GYM, level: 'intermediate', objectives: ['hypertrophy', 'endurance'] },
  reverseFly: { file: 'crucifixo-invertido.gif', families: ['pull', 'shoulders'], equipment: BOTH, level: 'intermediate', objectives: ['hypertrophy'] },
  facePull: { file: 'face-pull.gif', families: ['pull', 'shoulders'], equipment: GYM, level: 'intermediate', objectives: ['hypertrophy', 'endurance'] },
  dumbbellCurl: { file: 'biceps-halteres.gif', families: ['biceps', 'pull'], equipment: BOTH, level: 'beginner', objectives: ['hypertrophy'] },
  barbellCurl: { file: 'biceps-barra.gif', families: ['biceps', 'pull'], equipment: BOTH, level: 'intermediate', objectives: ['hypertrophy'] },
  hammerCurl: { file: 'rosca-martelo.gif', families: ['biceps', 'pull'], equipment: BOTH, level: 'beginner', objectives: ['hypertrophy'] },
  preacherCurl: { file: 'rosca-scott.gif', families: ['biceps', 'pull'], equipment: GYM, level: 'intermediate', objectives: ['hypertrophy'] },

  gobletSquat: { file: 'goblet-squat.gif', families: ['legs'], equipment: BOTH, level: 'beginner', objectives: ['hypertrophy', 'fatloss'] },
  legPress: { file: 'leg-press.gif', families: ['legs'], equipment: GYM, level: 'beginner', objectives: ['hypertrophy'] },
  legExtension: { file: 'extensao-pernas.gif', families: ['legs'], equipment: GYM, level: 'beginner', objectives: ['hypertrophy'] },
  legCurl: { file: 'mesa-flexora.gif', families: ['legs'], equipment: GYM, level: 'beginner', objectives: ['hypertrophy'] },
  walkingLunge: { file: 'passada.gif', families: ['legs'], equipment: BOTH, level: 'beginner', objectives: ['hypertrophy', 'fatloss', 'endurance'] },
  bulgarianSplitSquat: { file: 'agachamento-bulgaro.gif', families: ['legs'], equipment: BOTH, level: 'advanced', objectives: ['hypertrophy', 'fatloss'] },
  romanianDeadlift: { file: 'levantamento-romeno.gif', families: ['legs', 'posterior'], equipment: BOTH, level: 'advanced', objectives: ['hypertrophy'] },
  hipThrust: { file: 'hip-thrust.gif', families: ['legs', 'posterior'], equipment: BOTH, level: 'intermediate', objectives: ['hypertrophy'] },
  calfRaise: { file: 'panturrilha.gif', families: ['legs', 'calves'], equipment: BOTH, level: 'beginner', objectives: ['hypertrophy', 'endurance'] },

  lateralRaise: { file: 'elevacao-lateral.gif', families: ['shoulders', 'push'], equipment: BOTH, level: 'beginner', objectives: ['hypertrophy'] },
  shoulderPress: { file: 'desenvolvimento-ombro.gif', families: ['shoulders', 'push'], equipment: BOTH, level: 'intermediate', objectives: ['hypertrophy'] },
  arnoldPress: { file: 'arnold-press.gif', families: ['shoulders', 'push'], equipment: BOTH, level: 'intermediate', objectives: ['hypertrophy'] },

  plank: { file: 'prancha.gif', families: ['core'], equipment: BOTH, level: 'beginner', objectives: LIGHT },
  sidePlank: { file: 'prancha-lateral.gif', families: ['core'], equipment: BOTH, level: 'intermediate', objectives: LIGHT },
  deadBug: { file: 'dead-bug.gif', families: ['core'], equipment: BOTH, level: 'beginner', objectives: LIGHT },
  crunch: { file: 'abdominal.gif', families: ['core'], equipment: BOTH, level: 'beginner', objectives: LIGHT },
  legRaise: { file: 'elevacao-pernas.gif', families: ['core'], equipment: BOTH, level: 'intermediate', objectives: LIGHT },
  russianTwist: { file: 'russian-twist.gif', families: ['core'], equipment: BOTH, level: 'intermediate', objectives: LIGHT },
  bicycleCrunch: { file: 'abdominal-bicicleta.gif', families: ['core'], equipment: BOTH, level: 'intermediate', objectives: LIGHT },
  mountainClimber: { file: 'mountain-climber.gif', families: ['core', 'cardio'], equipment: BOTH, level: 'intermediate', objectives: LIGHT },
} satisfies Record<string, ExerciseInfo>;

export type ExerciseName = keyof typeof EXERCISES;

export const isExerciseName = (name: unknown): name is ExerciseName =>
  typeof name === 'string' && Object.prototype.hasOwnProperty.call(EXERCISES, name);

export const exerciseInfo = (name: string): ExerciseInfo | undefined =>
  isExerciseName(name) ? EXERCISES[name] : undefined;

/** Swap options per slot, in order of preference */
export const VARIANTS: Partial<Record<ExerciseName, ExerciseName[]>> = {
  benchPress: ['benchPress', 'inclineBenchPress', 'pushUps', 'pecDeck', 'machineFly', 'cableCrossover', 'chestDip'],
  machineFly: ['machineFly', 'pecDeck', 'benchPress', 'inclineBenchPress', 'pushUps', 'cableCrossover', 'reverseFly'],
  tricepsPushdown: ['tricepsPushdown', 'overheadTricepsExtension', 'lyingTricepsExtension', 'pushUps', 'chestDip'],
  lyingTricepsExtension: ['lyingTricepsExtension', 'tricepsPushdown', 'overheadTricepsExtension', 'pushUps', 'chestDip'],
  plank: ['plank', 'deadBug', 'sidePlank', 'crunch', 'legRaise', 'mountainClimber'],
  crunch: ['crunch', 'russianTwist', 'deadBug', 'legRaise', 'plank', 'sidePlank', 'bicycleCrunch', 'mountainClimber'],
  latPulldown: ['latPulldown', 'assistedPullUp', 'seatedRow', 'oneArmDumbbellRow', 'reverseFly', 'facePull'],
  seatedRow: ['seatedRow', 'oneArmDumbbellRow', 'latPulldown', 'assistedPullUp', 'reverseFly', 'facePull'],
  dumbbellCurl: ['dumbbellCurl', 'hammerCurl', 'barbellCurl', 'assistedPullUp', 'preacherCurl'],
  barbellCurl: ['barbellCurl', 'dumbbellCurl', 'hammerCurl', 'assistedPullUp', 'preacherCurl'],
  legRaise: ['legRaise', 'russianTwist', 'crunch', 'deadBug', 'plank', 'bicycleCrunch'],
  sidePlank: ['sidePlank', 'plank', 'deadBug', 'russianTwist', 'legRaise', 'mountainClimber'],
  gobletSquat: ['gobletSquat', 'walkingLunge', 'legPress', 'legExtension', 'legCurl', 'bulgarianSplitSquat', 'romanianDeadlift', 'hipThrust'],
  legPress: ['legPress', 'gobletSquat', 'walkingLunge', 'legExtension', 'legCurl', 'bulgarianSplitSquat', 'romanianDeadlift', 'calfRaise'],
  legExtension: ['legExtension', 'legCurl', 'legPress', 'gobletSquat', 'walkingLunge', 'bulgarianSplitSquat', 'calfRaise'],
  lateralRaise: ['lateralRaise', 'shoulderPress', 'arnoldPress', 'oneArmDumbbellRow', 'facePull', 'reverseFly'],
  shoulderPress: ['shoulderPress', 'arnoldPress', 'lateralRaise', 'pushUps', 'facePull', 'reverseFly'],
};

export const LEVEL_RANK: Record<Level, number> = { beginner: 1, intermediate: 2, advanced: 3 };
