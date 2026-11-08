import React from 'react';
import { Check } from 'lucide-react';

interface CheckButtonProps {
  checked: boolean;
  label: string;
  onToggle: () => void;
  tour?: string;
}

const CheckButton: React.FC<CheckButtonProps> = ({ checked, label, onToggle, tour }) => (
  <button
    type="button"
    data-tour={tour}
    role="checkbox"
    aria-checked={checked}
    aria-label={label}
    onClick={onToggle}
    className="w-11 h-11 flex items-center justify-center flex-shrink-0 rounded-full group"
  >
    <span
      key={String(checked)}
      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
        checked ? 'bg-success border-success text-white dark:text-canvas animate-pop' : 'border-line text-transparent group-hover:border-success'
      }`}
    >
      <Check size={17} strokeWidth={3} />
    </span>
  </button>
);

export default CheckButton;
