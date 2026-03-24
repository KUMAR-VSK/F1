import { NavLink } from 'react-router-dom';
import { CalendarDays, LayoutDashboard, Trophy, Radio, Settings, PlayCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCurrentWeekend } from '../services/sessionService';

export default function Sidebar() {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const check = async () => {
      const weekend = await getCurrentWeekend();
      setIsLive(weekend?.some(s => s.status === 'LIVE') ?? false);
    };
    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-64 bg-dark flex flex-col pt-12 border-r border-gray-800 h-full">
      <div className="px-6 mb-8 flex items-center justify-center">
        <h1 className="text-xl font-bold text-white flex flex-col items-center gap-1 tracking-tight">
          <span className="flex items-center gap-2 text-2xl">🏎️ <span className="text-f1red">F1</span></span>
          <span className="text-gray-400 text-[10px] tracking-widest uppercase">Companion App</span>
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        <NavLink to="/weekend" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-card text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-gray-700/50 scale-105' : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:scale-105'}`}>
          <CalendarDays size={20} />
          <span className="font-medium tracking-wide">Weekend View</span>
        </NavLink>
        <NavLink to="/live" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-f1red text-white shadow-[0_0_15px_rgba(225,6,0,0.4)] border border-red-800 scale-105' : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:scale-105'}`}>
          {({isActive}) => (<>
            <Radio size={20} className={isActive || isLive ? 'animate-pulse text-white' : ''} />
            <span className="font-medium tracking-wide flex items-center gap-2">
              Live Telemetry
              {isLive && !isActive && (
                <span className="text-[9px] font-black uppercase tracking-widest text-white bg-f1red px-1.5 py-0.5 rounded animate-pulse">LIVE</span>
              )}
            </span>
          </>)}
        </NavLink>
        <NavLink to="/watch" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-card text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-gray-700/50 scale-105' : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:scale-105'}`}>
          <PlayCircle size={20} />
          <span className="font-medium tracking-wide">Watch Stream</span>
        </NavLink>
        <NavLink to="/dashboard" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-card text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-gray-700/50 scale-105' : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:scale-105'}`}>
          <LayoutDashboard size={20} />
          <span className="font-medium tracking-wide">Dashboard</span>
        </NavLink>
        <NavLink to="/standings" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-card text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-gray-700/50 scale-105' : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:scale-105'}`}>
          <Trophy size={20} />
          <span className="font-medium tracking-wide">Standings</span>
        </NavLink>
      </nav>

      <nav className="px-4 pb-4">
        <NavLink to="/settings" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-card text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-gray-700/50 scale-105' : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:scale-105'}`}>
          <Settings size={20} />
          <span className="font-medium tracking-wide">Settings</span>
        </NavLink>
      </nav>
      
      <div className="p-4 border-t border-gray-800 mt-auto">
        <div className="bg-gray-900/50 rounded-lg p-4 text-xs text-gray-500 border border-gray-800 tracking-wide leading-relaxed">
          <p className="mb-1 text-gray-300 font-bold uppercase tracking-widest text-[10px]">Official Sources Only</p>
          <p>We do not scrape or embed unauthorized streams. Telemetry powered by OpenF1 API.</p>
        </div>
      </div>
    </div>
  );
}
