import { useState, useEffect } from 'react';
import VideoPlayer from '../components/VideoPlayer';
import { getDriverStandings } from '../services/ergastService';

export default function WatchRace() {
  const [url, setUrl] = useState('');
  const [activeUrl, setActiveUrl] = useState('');
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('lastStreamUrl');
    if (saved) {
      setUrl(saved);
      setActiveUrl(saved);
    }
    
    getDriverStandings().then(data => setStandings(data.slice(0, 10)));
  }, []);

  const handlePlay = (e) => {
    e.preventDefault();
    if (url) {
        setActiveUrl(url);
        localStorage.setItem('lastStreamUrl', url);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Live Race</h2>
          <p className="text-gray-400 mt-1">Watch and monitor live timing</p>
        </div>
      </div>

      <form onSubmit={handlePlay} className="flex gap-3">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste .m3u8 stream URL here..."
          className="flex-1 bg-card border border-gray-700/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-f1red transition-colors shadow-inner"
        />
        <button 
          type="submit"
          className="bg-f1red hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-f1red/20 active:scale-95"
        >
          Watch
        </button>
      </form>

      <div className="flex gap-6 h-full min-h-0 pb-10">
        <div className="flex-1 flex flex-col">
          <VideoPlayer streamUrl={activeUrl} />
        </div>
        
        {/* Quick Standings Sidebar overlay for Multi-view */}
        <div className="w-80 bg-card rounded-2xl border border-gray-800 p-5 flex flex-col overflow-hidden shadow-xl">
          <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-gray-400">Current Top 10</h3>
          <div className="overflow-y-auto pr-2 space-y-2 flex-1 relative custom-scroll">
            {standings.map((driver, idx) => (
              <div key={driver.position} className="flex items-center justify-between bg-darker p-3 rounded-lg border border-gray-800/50">
                <div className="flex items-center gap-3">
                  <span className="text-f1red font-bold w-4 text-center">{driver.position}</span>
                  <div>
                    <p className="font-semibold text-sm leading-tight">{driver.Driver.givenName} {driver.Driver.familyName}</p>
                    <p className="text-xs text-gray-500">{driver.Constructors[0]?.name}</p>
                  </div>
                </div>
                <span className="font-mono text-xs bg-gray-800 px-2 py-1 rounded text-gray-300 shadow-sm">{driver.points} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
