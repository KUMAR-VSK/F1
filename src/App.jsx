import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import Sidebar from './components/Sidebar';
import { getCurrentWeekend } from './services/sessionService';
import { triggerNotification } from './services/notificationService';
import { Trophy } from 'lucide-react';

const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const StandingsPage = React.lazy(() => import('./pages/StandingsPage'));
const WeekendView = React.lazy(() => import('./pages/WeekendView'));
const LiveTelemetry = React.lazy(() => import('./pages/LiveTelemetry'));
const WatchPage = React.lazy(() => import('./pages/WatchPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));

const Loader = () => (
  <div className="flex h-full items-center justify-center bg-transparent text-f1red font-bold animate-pulse text-xl uppercase tracking-widest gap-3 w-full">
    <Trophy className="animate-spin text-f1red" /> Loading Module...
  </div>
);

function App() {
  const notifiedSessions = useRef(new Set());
  const [theme, setTheme] = useState(localStorage.getItem('f1_theme') || 'dark');

  useEffect(() => {
    // Theme listener
    const applyTheme = () => {
       const userTheme = localStorage.getItem('f1_theme') || 'dark';
       setTheme(userTheme);
       if (userTheme === 'light') document.documentElement.classList.add('light-mode');
       else document.documentElement.classList.remove('light-mode');
    };
    applyTheme();
    window.addEventListener('storage', applyTheme);
    return () => window.removeEventListener('storage', applyTheme);
  }, []);

  useEffect(() => {
    const checkSessions = async () => {
      const notifsEnabled = localStorage.getItem('f1_notifications') !== 'false';
      if (!notifsEnabled) return;

      const weekend = await getCurrentWeekend();
      if (!weekend) return;
      
      const now = new Date().getTime();
      weekend.forEach(session => {
        const timeDiff = session.timestamp - now;
        const minutesUntil = Math.round(timeDiff / 60000);
        
        if (minutesUntil <= 10 && minutesUntil > 0 && !notifiedSessions.current.has(session.id)) {
          triggerNotification("F1 Session Starting Soon!", `${session.name} begins in ${minutesUntil} minutes!`);
          notifiedSessions.current.add(session.id);
        } else if (minutesUntil === 0 && !notifiedSessions.current.has(`${session.id}-live`)) {
          triggerNotification("F1 Session LIVE!", `${session.name} is now LIVE.`);
          notifiedSessions.current.add(`${session.id}-live`);
        }
      });
    };
    
    checkSessions();
    const interval = setInterval(checkSessions, 60000);
    return () => clearInterval(interval);
  }, []);

  const lastOpened = localStorage.getItem('f1_last_opened') || 'weekend';

  return (
    <Router>
      <div className={`flex h-screen bg-appBg text-appText transition-colors duration-300 ${theme}`}>
        <Sidebar />
        <main className="flex-1 overflow-hidden relative selection:bg-f1red selection:text-white">
          <div className="h-8 absolute top-0 left-0 right-0 app-region-drag z-50"></div>
          
          <div className="h-full pt-8 overflow-y-auto w-full block">
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Navigate to={`/${lastOpened}`} replace />} />
                <Route path="/weekend" element={<WeekendView />} />
                <Route path="/live" element={<LiveTelemetry />} />
                <Route path="/watch" element={<WatchPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/standings" element={<StandingsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Suspense>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
