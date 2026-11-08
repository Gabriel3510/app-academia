import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { usePreferences } from '../../contexts/preferences';
import { useWorkout } from '../../contexts/workout';
import type { TrainingProfile } from '../../types';
import { hasLegacyGroups } from '../../utils/storage';
import Logo from '../UI/Logo';
import OptionCards from '../UI/OptionCards';
import { equipmentOptions, levelOptions, objectiveOptions, sessionOptions } from '../UI/options';
import { LanguagePicker, ThemePicker } from '../UI/PreferencePickers';

const STEP_COUNT = 6;

interface OnboardingProps {
  /** On the first run the answers replace the starter plan; later they add a new profile */
  firstRun: boolean;
  onDone: () => void;
  onCancel?: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ firstRun, onDone, onCancel }) => {
  const { t, userName, setUserName, setOnboarded } = usePreferences();
  const { createFromProfile } = useWorkout();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(userName);
  const [profile, setProfile] = useState<TrainingProfile>({
    objectiveProfile: 'balanced',
    levelProfile: 'intermediate',
    equipmentProfile: 'mixed',
    sessionsWeekly: 4,
  });
  const isLast = step === STEP_COUNT - 1;
  const set = <K extends keyof TrainingProfile>(key: K) => (value: TrainingProfile[K]) => setProfile((prev) => ({ ...prev, [key]: value }));

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLast) {
      setStep(step + 1);
      return;
    }
    const trimmed = name.trim();
    setUserName(trimmed);
    createFromProfile(profile, trimmed ? t('onboarding.groupName', { name: trimmed }) : t('profiles.defaultName'), firstRun && !hasLegacyGroups());
    setOnboarded(true);
    onDone();
  };

  const titles = [
    t('onboarding.welcome.title'),
    t('onboarding.name.title'),
    t('onboarding.goal.title'),
    t('onboarding.level.title'),
    t('onboarding.equipment.title'),
    t('onboarding.sessions.title'),
  ];

  return createPortal(
    <div className="fixed inset-0 z-[60] bg-canvas flex items-start sm:items-center justify-center p-4 pt-safe overflow-y-auto">
      <form onSubmit={handleNext} role="dialog" aria-modal="true" aria-label={titles[step]} className="card w-full max-w-md p-6 shadow-xl my-4">
        <div className="flex items-center justify-between mb-4">
          <Logo size={48} />
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium text-subtle">{t('onboarding.step', { current: step + 1, total: STEP_COUNT })}</span>
            {onCancel && (
              <button type="button" onClick={onCancel} aria-label={t('common.close')} className="icon-btn -mr-2"><X size={20} /></button>
            )}
          </div>
        </div>
        <div className="flex gap-1.5 mb-5" aria-hidden="true">
          {Array.from({ length: STEP_COUNT }, (_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-surface-2'}`} />
          ))}
        </div>

        <div key={step} className="animate-rise">
          <h2 className="text-xl font-bold mb-2">{titles[step]}</h2>
          {step === 0 && (
            <>
              <p className="text-sm text-muted mb-5">{t('onboarding.welcome.body')}</p>
              <div className="space-y-4">
                <LanguagePicker />
                <ThemePicker />
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <p className="text-sm text-muted mb-5">{t('onboarding.name.body')}</p>
              <label className="block">
                <span className="field-label">{t('settings.name')}</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('onboarding.name.placeholder')}
                  maxLength={40}
                  autoFocus
                  className="input"
                />
              </label>
            </>
          )}
          {step === 2 && <div className="mt-4"><OptionCards label={titles[2]} value={profile.objectiveProfile} options={objectiveOptions(t)} onChange={set('objectiveProfile')} /></div>}
          {step === 3 && <div className="mt-4"><OptionCards label={titles[3]} value={profile.levelProfile} options={levelOptions(t)} onChange={set('levelProfile')} /></div>}
          {step === 4 && <div className="mt-4"><OptionCards label={titles[4]} value={profile.equipmentProfile} options={equipmentOptions(t)} onChange={set('equipmentProfile')} /></div>}
          {step === 5 && (
            <>
              <p className="text-sm text-muted mb-4">{t('onboarding.sessions.body')}</p>
              <OptionCards label={titles[5]} value={profile.sessionsWeekly} options={sessionOptions(t)} onChange={set('sessionsWeekly')} />
            </>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button type="button" onClick={() => setStep(step - 1)} className="btn-secondary flex-1">{t('common.back')}</button>
          )}
          <button type="submit" className="btn-primary flex-1">{t(isLast ? 'onboarding.start' : 'common.next')}</button>
        </div>
      </form>
    </div>,
    document.body,
  );
};

export default Onboarding;
