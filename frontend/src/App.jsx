import React from 'react';
import { LandingScreen } from './screens/LandingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { DoneScreen } from './screens/DoneScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { StatusBanner } from './components/StatusBanner';
import { useSession } from './hooks/useSession';
import styles from './App.module.css';

function App() {
  const {
    session,
    logs,
    isLoading,
    showApp,
    setShowApp,
    isConnected,
    handleStart,
    handleStop,
    handleResume,
  } = useSession();

  const isViewDashboard = session.status !== 'stopped' && session.status !== 'done';
  const showLanding = !showApp && (session.status === 'stopped' || session.status === 'done');

  return (
    <div className={showLanding ? styles.wrapperLanding : styles.wrapper}>
      <div className={styles.background}>
        <div className={styles.gradientTop} />
        <div className={styles.gradientBottom} />
      </div>

      {showLanding ? (
        <LandingScreen onLaunch={() => setShowApp(true)} />
      ) : !isViewDashboard && session.status !== 'done' ? (
        <LoginScreen onStart={handleStart} isLoading={isLoading} onBack={() => setShowApp(false)} />
      ) : session.status === 'done' ? (
        <DoneScreen 
          unlikedTotal={session.unlikedTotal} 
          onReset={handleStop} 
        />
      ) : (
        <DashboardScreen 
          stats={session} 
          logs={logs} 
          onStop={handleStop} 
          isConnected={isConnected} 
        />
      )}

      <StatusBanner status={session.status} onResume={handleResume} onStop={handleStop} />
    </div>
  );
}

export default App;
