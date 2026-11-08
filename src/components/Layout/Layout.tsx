import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { usePreferences } from '../../contexts/preferences';
import type { Page } from '../../types';
import Logo from '../UI/Logo';
import { NAV_ITEMS } from './navItems';

interface NavProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const Sidebar: React.FC<NavProps> = ({ activePage, onNavigate }) => {
  const { t } = usePreferences();
  return (
    <aside className="hidden md:flex flex-col w-64 flex-shrink-0 bg-surface border-r border-line h-dvh sticky top-0 overflow-y-auto">
      <button
        onClick={() => onNavigate('today')}
        aria-label={t('nav.today')}
        className="mx-2 mt-2 mb-1 px-3 py-3 flex items-center gap-3 rounded-xl text-left hover:bg-surface-2 transition-colors"
      >
        <Logo size={38} className="flex-shrink-0" />
        <span className="min-w-0">
          <span className="block font-bold leading-tight">{t('app.name')}</span>
          <span className="block text-xs text-subtle truncate">{t('app.tagline')}</span>
        </span>
      </button>
      <nav className="flex-1 px-3 pb-4 space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            data-tour={`nav-${id}`}
            aria-current={activePage === id ? 'page' : undefined}
            onClick={() => onNavigate(id)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activePage === id ? 'bg-primary-soft text-accent' : 'text-muted hover:bg-surface-2 hover:text-ink'
            }`}
          >
            <Icon size={20} />
            {t(label)}
          </button>
        ))}
      </nav>
      <p className="px-6 pb-5 text-xs text-subtle">{t('settings.motto')}</p>
    </aside>
  );
};

const BottomNav: React.FC<NavProps> = ({ activePage, onNavigate }) => {
  const { t } = usePreferences();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-line flex pb-safe">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const active = activePage === id;
        return (
          <button
            key={id}
            data-tour={`nav-${id}`}
            aria-current={active ? 'page' : undefined}
            onClick={() => onNavigate(id)}
            className={`flex-1 min-w-0 flex flex-col items-center pt-2 pb-1.5 gap-1 text-[11px] font-medium transition-colors ${active ? 'text-accent' : 'text-subtle'}`}
          >
            <span className={`px-4 py-0.5 rounded-full transition-colors ${active ? 'bg-primary-soft' : ''}`}><Icon size={21} /></span>
            <span className="max-w-full truncate px-0.5">{t(label)}</span>
          </button>
        );
      })}
    </nav>
  );
};

const Header: React.FC<NavProps> = ({ activePage, onNavigate }) => {
  const { t, isDark, setTheme } = usePreferences();
  const page = NAV_ITEMS.find((item) => item.id === activePage);

  return (
    <header className="sticky top-0 z-30 bg-hero text-on-hero pt-safe">
      <div className="flex items-center justify-between gap-2 px-2 md:px-6 py-1.5 md:py-2.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            onClick={() => onNavigate('today')}
            aria-label={t('nav.today')}
            className="md:hidden p-1.5 rounded-xl hover:bg-white/10 flex-shrink-0"
          >
            <Logo size={30} />
          </button>
          <h1 className="text-lg font-bold truncate">{page ? t(page.label) : t('app.name')}</h1>
        </div>
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          aria-label={t('theme.toggle')}
          title={t('theme.toggle')}
          className="hero-btn"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};

const Layout: React.FC<NavProps & { children: React.ReactNode }> = ({ activePage, onNavigate, children }) => (
  <div className="flex min-h-dvh bg-canvas">
    <Sidebar activePage={activePage} onNavigate={onNavigate} />
    <div className="flex-1 flex flex-col min-w-0">
      <Header activePage={activePage} onNavigate={onNavigate} />
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 pb-28 md:p-6">{children}</main>
    </div>
    <BottomNav activePage={activePage} onNavigate={onNavigate} />
  </div>
);

export default Layout;
