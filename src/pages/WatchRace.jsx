import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import { getDriverStandings } from '../services/ergastService';
import { getDefaultStream, setDefaultStream } from '../services/streamService';
import { Settings } from 'lucide-react';

export default function WatchRace() {
  const location = useLocation();
  const state = location.state || {};
  
  const [urlInput, setUrlInput] = useState(getDefaultStream());
  const [activeUrl, setActiveUrl] = useState('');
  const [standings, setStandings] = useState([]);
  const [showSettings, setShowSettings] = useState(!getDefaultStream());

  useEffect(() => {
    const saved = getDefaultStream();
    if (saved) {
      setUrlInput(saved);
      if (state.autoPlay || !activeUrl) setActiveUrl(saved);
    }
    
    getDriverStandings().then(data => setStandings(data?.slice(0, 10) || []));
  }, [state.autoPlay, state.sessionId]);

  const handleSaveStream = (e) => {
    e.preventDefault();
    if (urlInput) {
        setDefaultStream(urlInput);
        setActiveUrl(urlInput);
        setShowSettings(false);
    } else {
        setDefaultStream('');
        setActiveUrl('');
    }
  };

  return (
    <div className="p-8 h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            {state.sessionName ? (
               <><span className="text-f1red font-black uppercase text-xl border border-f1red px-3 py-1 rounded bg-red-900/20">LIVE</span> {state.sessionName}</>
            ) : "Race Player"}
          </h2>
          <p className="text-gray-400 mt-2 tracking-wide text-sm">{state.sessionName ? 'Auto-loaded official session stream' : 'Watch and monitor live timing'}</p>
        </div>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 px-4 py-2 bg-darker border border-gray-700 hover:border-gray-500 rounded-lg transition-all text-sm font-medium text-gray-300 shadow-sm"
        >
          <Settings size={16} /> Stream Config
        </button>
      </div>

      {showSettings && (
        <form onSubmit={handleSaveStream} className="flex gap-3 bg-card p-5 rounded-2xl border border-gray-800 shadow-xl mb-2 items-end">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Default Stream Provider URL (.m3u8)</label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Provide a legal HLS stream URL to link as your provider"
              className="w-full bg-darker border border-gray-700/80 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-f1red transition-colors shadow-inner"
            />
          </div>
          <button 
            type="submit"
            className="bg-gray-200 hover:bg-white text-black px-8 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95"
          >
            Save Configuration
          </button>
        </form>
      )}

      <div className="flex gap-6 h-full min-h-0 pb-10">
        <div className="flex-1 flex flex-col">
          <VideoPlayer streamUrl={activeUrl} />
        </div>
        
        {/* Quick Standings Sidebar overlay for Multi-view */}
        <div className="w-80 bg-card rounded-2xl border border-gray-800 p-5 flex flex-col overflow-hidden shadow-xl">
          <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-gray-400">Current Top 10</h3>
          <div className="overflow-y-auto pr-2 space-y-2 flex-1 relative custom-scroll">
            {standings?.map((driver) => (
              <div key={driver?.position} className="flex items-center justify-between bg-darker p-3 rounded-lg border border-gray-800/50">
                <div className="flex items-center gap-3">
                  <span className="text-f1red font-bold w-4 text-center">{driver?.position}</span>
                  <div>
                    <p className="font-semibold text-sm leading-tight">{driver?.Driver?.givenName} {driver?.Driver?.familyName}</p>
                    <p className="text-xs text-gray-500">{driver?.Constructors?.[0]?.name}</p>
                  </div>
                </div>
                <span className="font-mono text-xs bg-gray-800 px-2 py-1 rounded text-gray-300 shadow-sm">{driver?.points} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
