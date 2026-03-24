import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import StandingsPage from './pages/StandingsPage';
import WeekendView from './pages/WeekendView';
import LiveTelemetry from './pages/LiveTelemetry';
import WatchPage from './pages/WatchPage';
import SettingsPage from './pages/SettingsPage';
import { useEffect, useRef } from 'react';
import { getCurrentWeekend } from './services/sessionService';
import { triggerNotification } from './services/notificationService';

function App() {
  const notifiedSessions = useRef(new Set());

  useEffect(() => {
    const checkSessions = async () => {
      // Check if notifications are disabled in settings
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
    
    // Check every minute
    checkSessions();
    const interval = setInterval(checkSessions, 60000);
    return () => clearInterval(interval);
  }, []);

  const lastOpened = localStorage.getItem('f1_last_opened') || 'weekend';

  return (
    <Router>
      <div className="flex h-screen bg-[#0a0a0c]">
        <Sidebar />
        <main className="flex-1 overflow-hidden relative selection:bg-f1red selection:text-white">
          {/* Drag area for macOS frameless window */}
          <div className="h-8 absolute top-0 left-0 right-0 app-region-drag z-50"></div>
          
          <div className="h-full pt-8 overflow-y-auto w-full block">
            <Routes>
              <Route path="/" element={<Navigate to={`/${lastOpened}`} replace />} />
              <Route path="/weekend" element={<WeekendView />} />
              <Route path="/live" element={<LiveTelemetry />} />
              <Route path="/watch" element={<WatchPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/standings" element={<StandingsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
