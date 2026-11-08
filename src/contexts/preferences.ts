import { createContext, useContext } from 'react';
import type { DayKey, Language, ThemeMode } from '../types';
import type { TranslationKey } from '../i18n/translations';

export type TranslateFn = (key: TranslationKey, vars?: Record<string, string | number>) => string;

export interface Preferences {
  language: Language;
  theme: ThemeMode;
  userName: string;
  onboarded: boolean;
}

export interface PreferencesContextType extends Preferences {
  setLanguage: (language: Language) => void;
  setTheme: (theme: ThemeMode) => void;
  setUserName: (name: string) => void;
  setOnboarded: (done: boolean) => void;
  replacePreferences: (prefs: Preferences) => void;
  isDark: boolean;
  t: TranslateFn;
  /** Display name of an exercise key, falling back to the key itself */
  exerciseName: (name: string) => string;
  dayName: (day: DayKey) => string;
  /** Sets text with the stored English words translated */
  formatSets: (sets: string) => string;
  formatDate: (date: Date, options: Intl.DateTimeFormatOptions) => string;
}

export const PreferencesContext = createContext<PreferencesContextType | null>(null);

export const usePreferences = (): PreferencesContextType => {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
};
