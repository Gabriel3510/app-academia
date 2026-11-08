import { Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface OptionCard<T extends string | number> {
  value: T;
  label: string;
  hint?: string;
  icon?: LucideIcon;
}

interface OptionCardsProps<T extends string | number> {
  label: string;
  value: T;
  options: OptionCard<T>[];
  onChange: (value: T) => void;
}

/** Large radio cards, easier to tap and read than a select in the onboarding steps */
const OptionCards = <T extends string | number>({ label, value, options, onChange }: OptionCardsProps<T>) => (
  <div role="radiogroup" aria-label={label} className="space-y-2">
    {options.map(({ value: optionValue, label: optionLabel, hint, icon: Icon }) => {
      const selected = optionValue === value;
      return (
        <button
          key={String(optionValue)}
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => onChange(optionValue)}
          className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
            selected ? 'border-primary bg-primary-soft' : 'border-line hover:bg-surface-2'
          }`}
        >
          {Icon && (
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${selected ? 'bg-primary text-on-primary' : 'bg-surface-2 text-accent'}`}>
              <Icon size={20} />
            </span>
          )}
          <span className="flex-1 min-w-0">
            <span className="block text-sm font-semibold">{optionLabel}</span>
            {hint && <span className="block text-xs text-muted">{hint}</span>}
          </span>
          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'border-primary bg-primary text-on-primary' : 'border-line'}`}>
            {selected && <Check size={12} strokeWidth={3} />}
          </span>
        </button>
      );
    })}
  </div>
);

export default OptionCards;
