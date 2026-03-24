import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import WatchRace from './pages/WatchRace';
import DashboardPage from './pages/DashboardPage';
import StandingsPage from './pages/StandingsPage';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-darker">
        <Sidebar />
        <main className="flex-1 overflow-hidden relative selection:bg-f1red selection:text-white">
          {/* Drag area for macOS frameless window */}
          <div className="h-8 absolute top-0 left-0 right-0 app-region-drag z-50"></div>
          
          <div className="h-full pt-8 overflow-y-auto">
            <Routes>
              <Route path="/" element={<WatchRace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/standings" element={<StandingsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
