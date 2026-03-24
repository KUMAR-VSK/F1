import { NavLink } from 'react-router-dom';
import { CalendarDays, LayoutDashboard, Trophy, Radio } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 bg-dark flex flex-col pt-12 border-r border-gray-800 h-full">
      <div className="px-6 mb-8 flex items-center justify-center">
        <h1 className="text-xl font-bold text-white flex flex-col items-center gap-1 tracking-tight">
          <span className="flex items-center gap-2"><span className="text-f1red text-2xl">F1</span> LIVE</span>
          <span className="text-gray-400 text-[10px] tracking-widest uppercase">Companion App</span>
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        <NavLink to="/weekend" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-card text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-gray-700/50 scale-105' : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:scale-105'}`}>
          <CalendarDays size={20} />
          <span className="font-medium tracking-wide">Weekend View</span>
        </NavLink>
        <NavLink to="/live" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-f1red text-white shadow-[0_0_15px_rgba(225,6,0,0.4)] border border-red-800 scale-105' : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:scale-105'}`}>
          <Radio size={20} className={isActive ? 'animate-pulse text-white' : ''} />
          <span className="font-medium tracking-wide">Live Telemetry</span>
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
      
      <div className="p-4 border-t border-gray-800 mt-auto">
        <div className="bg-gray-900/50 rounded-lg p-4 text-xs text-gray-500 border border-gray-800 tracking-wide leading-relaxed">
          <p className="mb-1 text-gray-300 font-bold uppercase tracking-widest text-[10px]">Official Sources Only</p>
          <p>We do not scrape or embed unauthorized streams. Telemetry powered by OpenF1 API.</p>
        </div>
      </div>
    </div>
  );
}
