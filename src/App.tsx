import React, { useCallback, useState } from 'react';
import { PreferencesProvider } from './contexts/PreferencesProvider';
import { ToastProvider } from './contexts/ToastProvider';
import { WorkoutProvider } from './contexts/WorkoutProvider';
import { usePreferences } from './contexts/preferences';
import { useToast } from './contexts/toast';
import { useWorkout } from './contexts/workout';
import Layout from './components/Layout/Layout';
import Onboarding from './components/Tutorial/Onboarding';
import Tour from './components/Tutorial/Tour';
import TodayPage from './pages/TodayPage';
import PlanPage from './pages/PlanPage';
import ProfilesPage from './pages/ProfilesPage';
import SettingsPage from './pages/SettingsPage';
import type { DayKey, Page } from './types';

type Stage = 'onboarding' | 'redo' | 'tour' | null;

const Shell: React.FC = () => {
  const { t, onboarded } = usePreferences();
  const { data, toggleCollapsed } = useWorkout();
  const { showToast } = useToast();
  const [activePage, setActivePage] = useState<Page>('today');
  const [focusDay, setFocusDay] = useState<DayKey | null>(null);
  const [stage, setStage] = useState<Stage>(onboarded ? null : 'onboarding');

  const navigate = useCallback((page: Page) => {
    setActivePage(page);
    setFocusDay(null);
    window.scrollTo(0, 0);
  }, []);

  const openDay = (day: DayKey) => {
    if (data.collapsedDays.includes(day)) toggleCollapsed(day);
    setActivePage('plan');
    setFocusDay(day);
  };

  const endTour = useCallback(() => {
    setStage(null);
    navigate('today');
    showToast({ kind: 'success', message: t('tour.done') });
  }, [navigate, showToast, t]);

  const renderPage = () => {
    switch (activePage) {
      case 'today': return <TodayPage onOpenDay={openDay} />;
      case 'plan': return <PlanPage focusDay={focusDay} />;
      case 'profiles': return <ProfilesPage />;
      case 'settings': return <SettingsPage onStartTour={() => setStage('tour')} onRedoOnboarding={() => setStage('redo')} />;
    }
  };

  return (
    <>
      <Layout activePage={activePage} onNavigate={navigate}>
        {renderPage()}
      </Layout>
      {stage === 'onboarding' && <Onboarding firstRun onDone={() => { navigate('today'); setStage('tour'); }} />}
      {stage === 'redo' && (
        <Onboarding
          firstRun={false}
          onCancel={() => setStage(null)}
          onDone={() => { setStage(null); navigate('today'); showToast({ kind: 'success', message: t('onboarding.ready') }); }}
        />
      )}
      {stage === 'tour' && <Tour activePage={activePage} onNavigate={navigate} onClose={endTour} />}
    </>
  );
};

const App: React.FC = () => (
  <PreferencesProvider>
    <ToastProvider>
      <WorkoutProvider>
        <Shell />
      </WorkoutProvider>
    </ToastProvider>
  </PreferencesProvider>
);

export default App;
