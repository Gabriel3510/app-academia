import React, { useState } from 'react';
import { usePreferences } from '../../contexts/preferences';
import Modal from './Modal';

interface PromptDialogProps {
  title: string;
  label: string;
  initial: string;
  onSubmit: (value: string) => void;
  onClose: () => void;
}

/** Replaces window.prompt, which looks out of place and is blocked in some WebViews */
const PromptDialog: React.FC<PromptDialogProps> = ({ title, label, initial, onSubmit, onClose }) => {
  const { t } = usePreferences();
  const [value, setValue] = useState(initial);
  const trimmed = value.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trimmed) return;
    onSubmit(trimmed);
    onClose();
  };

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-5 space-y-5">
        <label className="block">
          <span className="field-label">{label}</span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={(e) => e.target.select()}
            maxLength={40}
            required
            autoFocus
            className="input"
          />
        </label>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">{t('common.cancel')}</button>
          <button type="submit" disabled={!trimmed} className="btn-primary flex-1">{t('common.save')}</button>
        </div>
      </form>
    </Modal>
  );
};

export default PromptDialog;
