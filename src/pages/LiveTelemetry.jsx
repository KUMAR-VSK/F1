import { useState, useEffect, useRef } from 'react';
import { Activity, Radio, Info } from 'lucide-react';
import { getLiveTelemetry } from '../services/openF1Service';
import { getCurrentWeekend } from '../services/sessionService';
import Leaderboard from '../components/Leaderboard';
import EventFeed from '../components/EventFeed';

export default function LiveTelemetry() {
  const [telemetryState, setTelemetryState] = useState({ telemetry: [], currentLap: 0, currentFlag: 'GREEN' });
  const [loading, setLoading] = useState(true);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [commentaryFeed, setCommentaryFeed] = useState([]);
  
  const prevTelemetry = useRef({});
  const processedPits = useRef(new Set());
  const processedFlags = useRef(new Set());

  useEffect(() => {
    localStorage.setItem('f1_last_opened', 'live');
    
    // Check if there is a LIVE session
    const loadInit = async () => {
      const weekend = await getCurrentWeekend();
      const live = weekend?.find(s => s.status === 'LIVE');
      setSessionInfo(live || null);
      
      const cached = localStorage.getItem('f1_telemetry_cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === 'object') {
             setTelemetryState(prev => ({...prev, telemetry: parsed}));
          }
        } catch(e) {}
      }
      setLoading(false);
    };
    loadInit();
  }, []);

  useEffect(() => {
    if (!sessionInfo) return; // Only poll if live session exists

    const fetchTelemetry = async () => {
      const data = await getLiveTelemetry();
      if (!data || data.telemetry.length === 0) return;
      
      localStorage.setItem('f1_telemetry_cache', JSON.stringify(data.telemetry));
      
      const newEvents = [];
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // 1. Position Changes (Overtakes/Drops)
      data.telemetry.forEach(driver => {
        const dNum = driver.driver_number;
        const prevDriver = prevTelemetry.current[dNum];
        
        if (prevDriver && prevDriver.position > driver.position) {
          const places = prevDriver.position - driver.position;
          newEvents.unshift({
            id: `p_gain_${dNum}_${Date.now()}`,
            text: `${driver.name_acronym} (${dNum}) gained ${places} position(s) -> P${driver.position}!`,
            time: timestamp,
            type: 'overtake'
          });
        }
      });

      // 2. Pit Stops
      if (data.pits && data.pits.length > 0) {
        data.pits.forEach(pit => {
          const pitId = `${pit.driver_number}-${pit.date}`;
          if (!processedPits.current.has(pitId)) {
            newEvents.unshift({
              id: pitId,
              text: `Driver ${pit.driver_number} exited pit. Stop duration: ${pit.pit_duration}s`,
              time: timestamp,
              type: 'pit'
            });
            processedPits.current.add(pitId);
          }
        });
      }

      // 3. Flag Status
      if (data.flags && data.flags.length > 0) {
         data.flags.forEach(flagEvent => {
           const flagId = `${flagEvent.flag}-${flagEvent.date}`;
           if (!processedFlags.current.has(flagId)) {
              if (flagEvent.message || flagEvent.flag) {
                newEvents.unshift({
                  id: flagId,
                  text: flagEvent.message ? flagEvent.message : `${flagEvent.flag} FLAG in sector ${flagEvent.sector || 'unknown'}`,
                  time: timestamp,
                  type: 'flag'
                });
              }
              processedFlags.current.add(flagId);
           }
         });
      }
      
      if (newEvents.length > 0) {
        setCommentaryFeed(prev => [...newEvents, ...prev].slice(0, 50));
      }

      data.telemetry.forEach(d => { prevTelemetry.current[d.driver_number] = d; });
      setTelemetryState(data);
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3500); // 3.5s rapid polling
    return () => clearInterval(interval);
  }, [sessionInfo]);

  const handleWatchOfficial = () => {
    if (window.electron && window.electron.openFanCode) {
      window.electron.openFanCode();
    } else {
      window.open('https://www.fancode.com/formula1', '_blank');
    }
  };

  const currentFlagColors = {
    'GREEN': 'text-green-500 border-green-500 bg-green-500/10 shadow-[0_0_15px_rgba(0,255,0,0.3)]',
    'YELLOW': 'text-yellow-500 border-yellow-500 bg-yellow-500/10 shadow-[0_0_15px_rgba(255,255,0,0.3)] animate-pulse',
    'RED': 'text-red-500 border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(255,0,0,0.3)] animate-pulse',
    'UNKNOWN': 'text-gray-500 border-gray-500 bg-gray-500/10'
  };

  const flagStyle = currentFlagColors[telemetryState.currentFlag] || currentFlagColors['UNKNOWN'];

  if (loading) return <div className="h-full flex items-center justify-center text-f1red animate-pulse text-xl uppercase font-black tracking-widest bg-darker"><Activity className="animate-spin mr-3"/> Connecting Telemetry...</div>;

  return (
    <div className="h-full bg-darker p-6 overflow-hidden flex flex-col">
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between z-10 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white uppercase tracking-tight flex items-center gap-4">
            Pit Wall Telemetry
            {sessionInfo && <span className="text-xs bg-f1red text-white px-3 py-1 rounded shadow-lg shadow-f1red/50 animate-pulse flex items-center gap-1"><Radio size={12}/> LIVE</span>}
          </h2>
          <p className="text-gray-400 font-mono tracking-wide text-sm mt-1">{sessionInfo ? `${sessionInfo.raceName} - ${sessionInfo.name}` : 'Awaiting Next Live Session Data Stream'}</p>
        </div>

        <div className="flex items-center gap-4">
           {sessionInfo && (
             <div className="flex gap-4 items-center">
               <div className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg flex flex-col items-center">
                 <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Lap</span>
                 <span className="text-xl font-mono text-white font-bold">{telemetryState.currentLap}</span>
               </div>
               <div className={`px-4 py-2 border rounded-lg flex flex-col items-center uppercase font-black tracking-wider transition-all duration-300 ${flagStyle}`}>
                 <span className="text-sm">{telemetryState.currentFlag === 'UNKNOWN' ? 'TRACK CLEAR' : `${telemetryState.currentFlag} TRACK`}</span>
               </div>
             </div>
           )}
           <button 
             onClick={handleWatchOfficial}
             className="px-6 py-3 bg-f1red hover:bg-red-600 text-white font-black uppercase tracking-widest text-sm rounded-lg shadow-[0_0_20px_rgba(225,6,0,0.3)] hover:scale-105 active:scale-95 transition-all"
           >
             Watch F1 Official
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* LEADERBOARD TABLE */}
        <div className="lg:col-span-8 flex flex-col bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 gap-3 p-3 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-black/80 border-b border-gray-800">
            <div className="col-span-2 text-center">Pos</div>
            <div className="col-span-1"></div>
            <div className="col-span-5">Driver Name</div>
            <div className="col-span-2 text-right">Gap to Leader</div>
            <div className="col-span-2 text-right">Interval</div>
          </div>
          
          <Leaderboard telemetry={telemetryState.telemetry} sessionInfo={sessionInfo} />
          
          <div className="p-2 bg-black/40 border-t border-gray-800 flex items-center gap-2 text-[10px] uppercase text-gray-500 font-mono tracking-widest justify-end pr-4">
             <Activity size={10} className="text-green-500 animate-pulse"/>
             Sync: 3.5s refresh · OpenF1 Data
          </div>
        </div>

        {/* COMMENTARY FEED */}
        <div className="lg:col-span-4 flex flex-col bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative">
          <div className="p-4 border-b border-gray-800 bg-black/80 flex items-center justify-between">
            <h3 className="text-white font-bold uppercase tracking-wider flex items-center gap-2 text-sm">
              <Info size={14} className="text-f1red"/> Race Control Log
            </h3>
          </div>
          
          <EventFeed feed={commentaryFeed} sessionInfo={sessionInfo} />
          
          {/* Gradient overlay for smooth scroll fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900/90 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
