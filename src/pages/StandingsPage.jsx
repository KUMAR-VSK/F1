import { useState, useEffect } from 'react';
import { getDriverStandings, getConstructorStandings, getDriverImage } from '../services/ergastService';
import { Search, Trophy } from 'lucide-react';

const DriverAvatar = ({ wikiUrl, fallbackName }) => {
  const [imgSrc, setImgSrc] = useState(null);
  useEffect(() => {
    if (wikiUrl) {
      getDriverImage(wikiUrl).then(url => {
        if (url) setImgSrc(url);
      });
    }
  }, [wikiUrl]);

  return imgSrc ? (
    <img src={imgSrc} alt={fallbackName} className="w-10 h-10 rounded-full object-cover border-2 border-gray-700 shadow-md shrink-0" />
  ) : (
    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-700 shadow-md shrink-0">
      <span className="text-gray-400 font-bold text-xs">{fallbackName.substring(0, 2).toUpperCase()}</span>
    </div>
  );
};

export default function StandingsPage() {
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [activeTab, setActiveTab] = useState('drivers');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    localStorage.setItem('f1_last_opened', 'standings');
    Promise.all([
      getDriverStandings(),
      getConstructorStandings()
    ]).then(([d, c]) => {
      setDrivers(d || []);
      setConstructors(c || []);
      
      // Offline Cache
      if (d && c) {
        localStorage.setItem('f1_standings_d', JSON.stringify(d));
        localStorage.setItem('f1_standings_c', JSON.stringify(c));
        setIsOffline(false);
      }
      setLoading(false);
    }).catch(err => {
      console.error("Standings error:", err);
      // Fallback
      setDrivers(JSON.parse(localStorage.getItem('f1_standings_d') || '[]'));
      setConstructors(JSON.parse(localStorage.getItem('f1_standings_c') || '[]'));
      setIsOffline(true);
      setLoading(false);
    });
  }, []);

  const filteredDrivers = drivers.filter(d => 
    d.Driver.givenName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.Driver.familyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.Constructors[0]?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredConstructors = constructors.filter(c => 
    c.Constructor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 h-full flex flex-col pt-12">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center mb-8 gap-4">
        <div>
           <h2 className="text-4xl font-extrabold tracking-tight uppercase flex items-center gap-3">
             <Trophy className="text-f1red" size={36}/> Championship Standings
           </h2>
           {isOffline && <span className="text-f1red font-mono text-xs uppercase tracking-widest mt-1 block animate-pulse">Offline Mode (Cached Data)</span>}
        </div>
        
        <div className="relative">
           <input 
             type="text" 
             placeholder={activeTab === 'drivers' ? 'Search Driver or Team...' : 'Search Constructor...'}
             value={searchQuery}
             onChange={e => setSearchQuery(e.target.value)}
             className="w-full lg:w-80 bg-gray-900 border border-gray-700 focus:border-f1red rounded-xl px-12 py-3 text-white font-mono text-sm shadow-xl outline-none transition-all placeholder-gray-500"
           />
           <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
        </div>
      </div>
      
      <div className="flex gap-2 mb-6 p-1.5 bg-darker rounded-xl w-fit border border-gray-800 shadow-inner">
        <button 
          onClick={() => { setActiveTab('drivers'); setSearchQuery(''); }}
          className={`px-6 py-2.5 rounded-lg font-bold transition-all text-sm uppercase tracking-wider ${activeTab === 'drivers' ? 'bg-f1red text-white shadow-[0_0_15px_rgba(225,6,0,0.5)] scale-105' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Drivers
        </button>
        <button 
          onClick={() => { setActiveTab('constructors'); setSearchQuery(''); }}
          className={`px-6 py-2.5 rounded-lg font-bold transition-all text-sm uppercase tracking-wider ${activeTab === 'constructors' ? 'bg-f1red text-white shadow-[0_0_15px_rgba(225,6,0,0.5)] scale-105' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Constructors
        </button>
      </div>

      <div className="flex-1 bg-gray-900/60 backdrop-blur-md rounded-3xl border border-gray-800 overflow-hidden shadow-2xl relative flex flex-col min-h-0">
        {loading && <div className="absolute inset-0 bg-card/80 flex items-center justify-center z-10 backdrop-blur-sm"><p className="text-f1red animate-pulse font-bold tracking-widest uppercase flex items-center gap-2"><Trophy className="animate-spin"/> Loading Standings...</p></div>}
        
        <div className="overflow-y-auto h-full px-2 custom-scroll flex-1">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-black/80 backdrop-blur-md z-10">
              <tr className="text-gray-500 text-xs font-black uppercase tracking-widest shadow-md">
                <th className="p-5 font-semibold w-16 text-center border-b border-gray-800">Pos</th>
                {activeTab === 'drivers' && <th className="p-5 font-semibold border-b border-gray-800">Driver</th>}
                <th className="p-5 font-semibold border-b border-gray-800">{activeTab === 'drivers' ? 'Constructor' : 'Team'}</th>
                <th className="p-5 font-semibold text-center border-b border-gray-800">Wins</th>
                <th className="p-5 font-semibold text-right border-b border-gray-800">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {activeTab === 'drivers' ? (
                filteredDrivers.length > 0 ? filteredDrivers.map(driver => (
                  <tr key={driver.position} className="hover:bg-gray-800/60 transition-colors group">
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold shadow-sm ${driver.position === '1' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.3)] scale-110' : driver.position === '2' ? 'bg-gray-300/20 text-gray-300 border border-gray-300/30' : driver.position === '3' ? 'bg-orange-700/20 text-orange-500 border border-orange-700/30' : 'text-gray-400 bg-black/40'}`}>
                        {driver.position}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <DriverAvatar wikiUrl={driver.Driver.url} fallbackName={driver.Driver.givenName} />
                        <div className="flex flex-col">
                          <span className="font-bold text-lg text-white group-hover:text-f1red transition-colors">{driver.Driver.givenName} {driver.Driver.familyName} <span className="text-gray-600 font-mono text-xs ml-1">#{driver.Driver.permanentNumber}</span></span>
                          <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">{driver.Driver.nationality}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300 uppercase tracking-wider font-bold text-sm">{driver.Constructors[0]?.name}</td>
                    <td className="p-4 text-center text-gray-400 font-mono text-lg">{driver.wins}</td>
                    <td className="p-4 text-right font-mono font-black text-2xl text-white">{driver.points}</td>
                  </tr>
                )) : <tr><td colSpan="5" className="p-20 text-center font-mono opacity-50 uppercase tracking-widest text-sm">No drivers found matching '{searchQuery}'</td></tr>
              ) : (
                filteredConstructors.length > 0 ? filteredConstructors.map(team => (
                  <tr key={team.position} className="hover:bg-gray-800/60 transition-colors group">
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold shadow-sm ${team.position === '1' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.3)] scale-110' : team.position === '2' ? 'bg-gray-300/20 text-gray-300 border border-gray-300/30' : team.position === '3' ? 'bg-orange-700/20 text-orange-500 border border-orange-700/30' : 'text-gray-400 bg-black/40'}`}>
                        {team.position}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <DriverAvatar wikiUrl={team.Constructor.url} fallbackName={team.Constructor.name} />
                        <div className="flex flex-col">
                          <span className="font-bold text-lg text-white group-hover:text-f1red transition-colors uppercase tracking-wider">{team.Constructor.name}</span>
                          <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">{team.Constructor.nationality}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center text-gray-400 font-mono text-lg">{team.wins}</td>
                    <td className="p-4 text-right font-mono font-black text-2xl text-white">{team.points}</td>
                  </tr>
                )) : <tr><td colSpan="4" className="p-20 text-center font-mono opacity-50 uppercase tracking-widest text-sm">No constructors found matching '{searchQuery}'</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
