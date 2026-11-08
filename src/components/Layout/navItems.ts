import { CalendarCheck, Dumbbell, Settings, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TranslationKey } from '../../i18n/translations';
import type { Page } from '../../types';

export const NAV_ITEMS: { id: Page; label: TranslationKey; icon: LucideIcon }[] = [
  { id: 'today', label: 'nav.today', icon: CalendarCheck },
  { id: 'plan', label: 'nav.plan', icon: Dumbbell },
  { id: 'profiles', label: 'nav.profiles', icon: Users },
  { id: 'settings', label: 'nav.settings', icon: Settings },
];
