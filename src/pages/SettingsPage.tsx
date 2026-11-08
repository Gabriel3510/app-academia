import React, { useRef, useState } from 'react';
import { ChevronRight, Download, GraduationCap, Trash2, Upload, Wand2 } from 'lucide-react';
import { usePreferences } from '../contexts/preferences';
import { useToast } from '../contexts/toast';
import { useWorkout } from '../contexts/workout';

import type { Preferences } from '../contexts/preferences';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import Logo from '../components/UI/Logo';
import { LanguagePicker, ThemePicker } from '../components/UI/PreferencePickers';
import { saveTextFile } from '../utils/saveFile';
import { createBackup, eraseAllData, parseBackup } from '../utils/storage';
import { toDateKey } from '../utils/week';

const NameForm: React.FC = () => {
  const { t, userName, setUserName } = usePreferences();
  const { showToast } = useToast();
  const [value, setValue] = useState(userName);
  const changed = value.trim() !== userName;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserName(value.trim());
    showToast({ kind: 'success', message: t('settings.nameSaved') });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label className="field-label" htmlFor="user-name">{t('settings.name')}</label>
      <div className="flex gap-2">
        <input id="user-name" value={value} onChange={(e) => setValue(e.target.value)} maxLength={40} placeholder={t('onboarding.name.placeholder')} className="input flex-1" />
        <button type="submit" disabled={!changed} className="btn-primary">{t('common.save')}</button>
      </div>
      <p className="text-xs text-subtle mt-1.5">{t('settings.nameHint')}</p>
    </form>
  );
};

const ActionRow: React.FC<{ icon: React.ReactNode; label: string; hint?: string; danger?: boolean; onClick: () => void }> = ({ icon, label, hint, danger, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${danger ? 'hover:bg-danger-soft' : 'hover:bg-surface-2'}`}>
    <span className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${danger ? 'bg-danger-soft text-danger' : 'bg-surface-2 text-accent'}`}>{icon}</span>
    <span className="flex-1 min-w-0">
      <span className={`block text-sm font-medium ${danger ? 'text-danger' : ''}`}>{label}</span>
      {hint && <span className="block text-xs text-muted">{hint}</span>}
    </span>
    <ChevronRight size={18} className="text-subtle flex-shrink-0" />
  </button>
);

interface PendingConfirm {
  title: string;
  body: string;
  label: string;
  run: () => void;
}

interface SettingsPageProps {
  onStartTour: () => void;
  onRedoOnboarding: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onStartTour, onRedoOnboarding }) => {
  const prefs = usePreferences();
  const { t, replacePreferences } = prefs;
  const { data, replaceData } = useWorkout();
  const { showToast } = useToast();
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    const current: Preferences = { language: prefs.language, theme: prefs.theme, userName: prefs.userName, onboarded: prefs.onboarded };
    try {
      const result = await saveTextFile(`academia-backup-${toDateKey(new Date())}.json`, createBackup(data, current));
      if (result === 'done') showToast({ kind: 'success', message: t('settings.exported') });
    } catch {
      showToast({ kind: 'error', message: t('settings.exportError') });
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const backup = parseBackup(await file.text());
    if (!backup) {
      showToast({ kind: 'error', message: t('settings.importInvalid') });
      return;
    }
    setPending({
      title: t('settings.importTitle'),
      body: t('settings.importBody'),
      label: t('settings.import'),
      run: () => {
        replaceData(backup.data);
        if (backup.prefs) replacePreferences({ ...backup.prefs, onboarded: true });
        showToast({ kind: 'success', message: t('settings.imported') });
      },
    });
  };

  const confirmErase = () => setPending({
    title: t('settings.eraseTitle'),
    body: t('settings.eraseBody'),
    label: t('settings.erase'),
    run: () => {
      eraseAllData();
      window.location.reload();
    },
  });

  return (
    <div className="grid gap-4 md:gap-6 lg:grid-cols-2 items-start">
      <div className="space-y-4 md:space-y-6">
        <section className="card p-4 md:p-5 space-y-4">
          <h2 className="font-semibold">{t('settings.appearance')}</h2>
          <LanguagePicker />
          <ThemePicker />
        </section>

        <section className="card p-4 md:p-5 space-y-3">
          <h2 className="font-semibold">{t('settings.profile')}</h2>
          <NameForm />
        </section>
      </div>

      <div className="space-y-4 md:space-y-6">
        <section data-tour="settings-data" className="card overflow-hidden">
          <div className="p-4 md:p-5 pb-2 md:pb-2">
            <h2 className="font-semibold">{t('settings.data')}</h2>
            <p className="text-sm text-muted">{t('settings.dataHint')}</p>
          </div>
          <div className="divide-y divide-line">
            <ActionRow icon={<Download size={18} />} label={t('settings.export')} onClick={() => void handleExport()} />
            <ActionRow icon={<Upload size={18} />} label={t('settings.import')} onClick={() => fileRef.current?.click()} />
            <ActionRow icon={<Trash2 size={18} />} label={t('settings.erase')} danger onClick={confirmErase} />
          </div>
          <input ref={fileRef} type="file" accept="application/json,.json" onChange={(e) => void handleFile(e)} className="hidden" />
        </section>

        <section className="card overflow-hidden">
          <h2 className="font-semibold p-4 md:p-5 pb-2 md:pb-2">{t('settings.help')}</h2>
          <div className="divide-y divide-line">
            <ActionRow icon={<GraduationCap size={18} />} label={t('settings.tutorial')} onClick={onStartTour} />
            <ActionRow icon={<Wand2 size={18} />} label={t('settings.onboarding')} hint={t('settings.onboardingHint')} onClick={onRedoOnboarding} />
          </div>
        </section>

        <section className="card p-4 md:p-5 flex items-center gap-4">
          <Logo size={48} className="flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold">{t('app.name')}</p>
            <p className="text-xs text-subtle">{t('settings.version', { version: __APP_VERSION__ })}</p>
            <p className="text-sm text-muted mt-1">{t('settings.motto')}</p>
            <p className="text-xs text-subtle">{t('settings.credit')}</p>
          </div>
        </section>
      </div>

      {pending && (
        <ConfirmDialog title={pending.title} body={pending.body} confirmLabel={pending.label} onConfirm={pending.run} onClose={() => setPending(null)} />
      )}
    </div>
  );
};

export default SettingsPage;
