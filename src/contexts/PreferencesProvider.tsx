import React, { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TRANSLATIONS } from '../i18n/translations';
import type { TranslationKey } from '../i18n/translations';
import { createDefaultPreferences, normalizePreferences, PREFS_KEY } from '../utils/storage';
import { PreferencesContext } from './preferences';
import type { Preferences, PreferencesContextType, TranslateFn } from './preferences';

const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)');

const subscribeSystemTheme = (onChange: () => void) => {
  const query = darkQuery();
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};

const HERO = { light: '#181a22', dark: '#1b1e28' };

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prefs, setPrefs] = useLocalStorage<Preferences>(PREFS_KEY, createDefaultPreferences, normalizePreferences);
  const systemDark = useSyncExternalStore(subscribeSystemTheme, () => darkQuery().matches);
  const { language, theme } = prefs;
  const isDark = theme === 'dark' || (theme === 'system' && systemDark);

  const t = useCallback<TranslateFn>((key, vars) => {
    const text = TRANSLATIONS[language][key] ?? key;
    if (!vars) return text;
    return Object.entries(vars).reduce((acc, [name, value]) => acc.replaceAll(`{${name}}`, String(value)), text);
  }, [language]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    const color = isDark ? HERO.dark : HERO.light;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
    if (Capacitor.isNativePlatform()) {
      // The header is always dark, so the status bar icons stay light in both themes
      void StatusBar.setStyle({ style: Style.Dark });
      if (Capacitor.getPlatform() === 'android') void StatusBar.setBackgroundColor({ color });
    }
  }, [isDark]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t('app.name');
  }, [language, t]);

  const value = useMemo<PreferencesContextType>(() => {
    const dictionary = TRANSLATIONS[language];
    return {
      ...prefs,
      setLanguage: (next) => setPrefs((prev) => ({ ...prev, language: next })),
      setTheme: (next) => setPrefs((prev) => ({ ...prev, theme: next })),
      setUserName: (name) => setPrefs((prev) => ({ ...prev, userName: name })),
      setOnboarded: (done) => setPrefs((prev) => ({ ...prev, onboarded: done })),
      replacePreferences: (next) => setPrefs(next),
      isDark,
      t,
      exerciseName: (name) => dictionary[`ex.${name}` as TranslationKey] ?? name,
      dayName: (day) => dictionary[`day.${day}`],
      formatSets: (sets) => sets.replace(/\beach\b/g, dictionary['sets.each']),
      formatDate: (date, options) => new Intl.DateTimeFormat(language, options).format(date),
    };
  }, [prefs, language, isDark, t, setPrefs]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
};
