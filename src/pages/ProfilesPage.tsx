import React, { useState } from 'react';
import { Copy, Pencil, Plus, Sparkles, Trash2 } from 'lucide-react';
import { usePreferences } from '../contexts/preferences';
import { useToast } from '../contexts/toast';
import { useWorkout } from '../contexts/workout';
import { DAY_KEYS } from '../types';
import type { DayKey, Equipment, Level, Objective, SwapPolicy, WorkoutGroup } from '../types';
import EfficiencyCard from '../components/Profiles/EfficiencyCard';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import PromptDialog from '../components/UI/PromptDialog';
import Select from '../components/UI/Select';
import { asSelect, equipmentOptions, levelOptions, objectiveOptions, policyOptions } from '../components/UI/options';

type Dialog =
  | { kind: 'create' }
  | { kind: 'duplicate'; group: WorkoutGroup }
  | { kind: 'rename'; group: WorkoutGroup }
  | { kind: 'delete'; group: WorkoutGroup }
  | { kind: 'regenerate'; group: WorkoutGroup };

const ProfilesPage: React.FC = () => {
  const { t } = usePreferences();
  const { showToast } = useToast();
  const { groups, activeGroup, setActiveGroup, createGroup, duplicateGroup, updateGroup, deleteGroup, regeneratePlan } = useWorkout();
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const close = () => setDialog(null);

  const toggleTrainingDay = (key: DayKey) => {
    const has = activeGroup.trainingDays.includes(key);
    if (has && activeGroup.trainingDays.length === 1) {
      showToast({ kind: 'warning', message: t('profiles.daysMin') });
      return;
    }
    const next = has ? activeGroup.trainingDays.filter((day) => day !== key) : DAY_KEYS.filter((day) => day === key || activeGroup.trainingDays.includes(day));
    updateGroup(activeGroup.id, { trainingDays: next });
  };

  const requestDelete = (group: WorkoutGroup) => {
    if (groups.length <= 1) showToast({ kind: 'warning', message: t('profiles.deleteBlocked') });
    else setDialog({ kind: 'delete', group });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <p className="text-sm text-muted">{t('profiles.subtitle')}</p>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-2 items-start">
        <div className="space-y-4">
          <div data-tour="profiles" className="card divide-y divide-line">
            {groups.map((group) => {
              const active = group.id === activeGroup.id;
              return (
                <div key={group.id} className={`p-4 ${active ? 'bg-primary-soft/50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{group.name}</p>
                      <p className="text-xs text-muted truncate">
                        {t(`objective.${group.objectiveProfile}`)} · {t(`level.${group.levelProfile}`)} · {t('sessions.value', { count: group.trainingDays.length })}
                      </p>
                    </div>
                    {active ? (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary text-on-primary">{t('profiles.active')}</span>
                    ) : (
                      <button
                        onClick={() => { setActiveGroup(group.id); showToast({ kind: 'success', message: t('profiles.switched', { name: group.name }) }); }}
                        className="btn-secondary min-h-[36px] py-1"
                      >
                        {t('profiles.use')}
                      </button>
                    )}
                  </div>
                  {active && (
                    <div className="flex flex-wrap gap-1 mt-2 -ml-2">
                      <button onClick={() => setDialog({ kind: 'rename', group })} className="btn min-h-[36px] px-2.5 text-muted hover:bg-surface-2"><Pencil size={15} /> {t('profiles.rename')}</button>
                      <button onClick={() => setDialog({ kind: 'duplicate', group })} className="btn min-h-[36px] px-2.5 text-muted hover:bg-surface-2"><Copy size={15} /> {t('profiles.duplicate')}</button>
                      <button onClick={() => requestDelete(group)} className="btn min-h-[36px] px-2.5 text-danger hover:bg-danger-soft"><Trash2 size={15} /> {t('profiles.delete')}</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={() => setDialog({ kind: 'create' })} className="btn-primary w-full"><Plus size={18} /> {t('profiles.new')}</button>
          <EfficiencyCard plan={activeGroup.plan} />
        </div>

        <div className="card p-4 md:p-5 space-y-4">
          <h2 className="font-semibold">{t('profiles.settings')}</h2>
          <div>
            <span className="field-label">{t('profiles.days')}</span>
            <div className="grid grid-cols-5 gap-1.5" role="group" aria-label={t('profiles.days')}>
              {DAY_KEYS.map((key) => {
                const on = activeGroup.trainingDays.includes(key);
                return (
                  <button
                    key={key}
                    aria-pressed={on}
                    onClick={() => toggleTrainingDay(key)}
                    className={`min-h-[42px] rounded-xl text-sm font-semibold transition-colors ${on ? 'bg-primary text-on-primary' : 'bg-surface-2 text-muted hover:text-ink'}`}
                  >
                    {t(`dayShort.${key}`)}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-subtle mt-1.5">{t('profiles.daysHint')}</p>
          </div>
          <label className="block">
            <span className="field-label">{t('profiles.objective')}</span>
            <Select label={t('profiles.objective')} value={activeGroup.objectiveProfile} options={asSelect(objectiveOptions(t))} onChange={(value) => updateGroup(activeGroup.id, { objectiveProfile: value as Objective })} />
          </label>
          <label className="block">
            <span className="field-label">{t('profiles.level')}</span>
            <Select label={t('profiles.level')} value={activeGroup.levelProfile} options={asSelect(levelOptions(t))} onChange={(value) => updateGroup(activeGroup.id, { levelProfile: value as Level })} />
          </label>
          <label className="block">
            <span className="field-label">{t('profiles.equipment')}</span>
            <Select label={t('profiles.equipment')} value={activeGroup.equipmentProfile} options={asSelect(equipmentOptions(t))} onChange={(value) => updateGroup(activeGroup.id, { equipmentProfile: value as Equipment })} />
          </label>
          <label className="block">
            <span className="field-label">{t('profiles.swapPolicy')}</span>
            <Select label={t('profiles.swapPolicy')} value={activeGroup.swapPolicy} options={policyOptions(t)} onChange={(value) => updateGroup(activeGroup.id, { swapPolicy: value as SwapPolicy })} />
          </label>
          <button onClick={() => setDialog({ kind: 'regenerate', group: activeGroup })} className="btn-secondary w-full">
            <Sparkles size={16} /> {t('profiles.regenerate')}
          </button>
        </div>
      </div>

      {dialog?.kind === 'create' && (
        <PromptDialog
          title={t('profiles.new')}
          label={t('profiles.namePrompt')}
          initial={t('profiles.defaultName')}
          onSubmit={(name) => { createGroup(name); showToast({ kind: 'success', message: t('profiles.created') }); }}
          onClose={close}
        />
      )}
      {dialog?.kind === 'duplicate' && (
        <PromptDialog
          title={t('profiles.duplicate')}
          label={t('profiles.namePrompt')}
          initial={`${dialog.group.name} (${t('profiles.copySuffix')})`}
          onSubmit={(name) => { duplicateGroup(dialog.group.id, name); showToast({ kind: 'success', message: t('profiles.created') }); }}
          onClose={close}
        />
      )}
      {dialog?.kind === 'rename' && (
        <PromptDialog
          title={t('profiles.rename')}
          label={t('profiles.namePrompt')}
          initial={dialog.group.name}
          onSubmit={(name) => updateGroup(dialog.group.id, { name })}
          onClose={close}
        />
      )}
      {dialog?.kind === 'delete' && (
        <ConfirmDialog
          title={t('profiles.deleteTitle', { name: dialog.group.name })}
          body={t('profiles.deleteBody')}
          confirmLabel={t('common.delete')}
          onConfirm={() => { deleteGroup(dialog.group.id); showToast({ kind: 'success', message: t('profiles.deleted') }); }}
          onClose={close}
        />
      )}
      {dialog?.kind === 'regenerate' && (
        <ConfirmDialog
          title={t('profiles.regenerateTitle')}
          body={t('profiles.regenerateBody')}
          tone="primary"
          onConfirm={() => { regeneratePlan(dialog.group.id); showToast({ kind: 'success', message: t('profiles.regenerated') }); }}
          onClose={close}
        />
      )}
    </div>
  );
};

export default ProfilesPage;
