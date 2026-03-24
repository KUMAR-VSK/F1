import { NavLink } from 'react-router-dom';
import { PlayCircle, LayoutDashboard, Trophy } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="w-64 bg-dark flex flex-col pt-12 border-r border-gray-800 h-full">
      <div className="px-6 mb-8 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
          <span className="text-f1red">F1</span> VIEWER
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        <NavLink to="/" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-card text-white shadow-lg border border-gray-700/50' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
          <PlayCircle size={20} />
          <span className="font-medium">Watch Race</span>
        </NavLink>
        <NavLink to="/dashboard" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-card text-white shadow-lg border border-gray-700/50' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </NavLink>
        <NavLink to="/standings" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-card text-white shadow-lg border border-gray-700/50' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
          <Trophy size={20} />
          <span className="font-medium">Standings</span>
        </NavLink>
      </nav>
      
      <div className="p-4 border-t border-gray-800 mt-auto">
        <div className="bg-gray-800/50 rounded-lg p-4 text-xs text-gray-400">
          <p className="mb-1 text-gray-300 font-semibold">Legal Disclaimer</p>
          <p>This application does not provide official streams. Please use appropriate and legitimate stream URLs.</p>
        </div>
      </div>
    </div>
  );
}
