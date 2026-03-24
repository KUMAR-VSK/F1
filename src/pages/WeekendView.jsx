import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Clock, CheckCircle, Activity, Trophy } from 'lucide-react';
import { getCurrentWeekend } from '../services/sessionService';
import { getLivePositions } from '../services/openF1Service';

export default function WeekendView() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [lastOpened, setLastOpened] = useState(null);

  useEffect(() => {
    localStorage.setItem('f1_last_opened', 'weekend');
    setLastOpened(new Date().toISOString());

    const fetchSessions = async () => {
      try {
        const data = await getCurrentWeekend();
        setSessions(data || []);
      } catch (err) {
        console.error("Session Fetch Error:", err);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
    const sessionInterval = setInterval(fetchSessions, 60000); // Check sessions every minute

    return () => clearInterval(sessionInterval);
  }, []);

  // Poll for live data if a session is currently live
  useEffect(() => {
    const liveSession = sessions.find(s => s.status === 'LIVE');
    if (!liveSession) {
      setLiveData([]);
      return;
    }

    const fetchLiveData = async () => {
      setIsDataLoading(true);
      const data = await getLivePositions();
      if (data && data.length > 0) setLiveData(data);
      setIsDataLoading(false);
    };

    fetchLiveData();
    const dataInterval = setInterval(fetchLiveData, 15000); // Every 15 seconds
    return () => clearInterval(dataInterval);
  }, [sessions]);

  // Countdown timer logic
  const [now, setNow] = useState(new Date().getTime());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date().getTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (timestamp) => {
    const diff = timestamp - now;
    if (diff <= 0) return '00:00:00';
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const handleWatch = () => {
    if (window.electron && window.electron.openFanCode) {
      window.electron.openFanCode();
    } else {
      window.open('https://www.fancode.com/formula1', '_blank');
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center bg-darker text-f1red animate-pulse text-2xl font-black uppercase tracking-widest"><Activity className="mr-3 animate-spin" /> Loading Weekend Data...</div>;
  if (!sessions.length) return <div className="flex h-full items-center justify-center bg-darker text-gray-500 font-bold uppercase tracking-widest">No Active Sessions</div>;

  return (
    <div className="h-full overflow-y-auto bg-darker p-8 w-full block">
      <div className="mb-10 text-center">
        <h2 className="text-5xl font-extrabold tracking-tight mb-3 text-white drop-shadow-lg uppercase shadow-f1red">{sessions[0]?.raceName}</h2>
        <p className="text-xl text-gray-400 font-semibold tracking-wider font-mono">{sessions[0]?.circuit}</p>
      </div>

      {/* MULTI-VIEW LAYOUT */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* SESSIONS TIMELINE */}
        <div className="lg:col-span-8 bg-black/60 backdrop-blur-md rounded-3xl border border-gray-800 p-8 shadow-2xl">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-4 text-white uppercase tracking-wider">
            Weekend Schedule
            {sessions.some(s => s.status === 'LIVE') && (
              <span className="bg-f1red text-white text-sm font-black uppercase px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(225,6,0,0.6)] animate-pulse border border-red-500">Live Now</span>
            )}
          </h3>

          <div className="space-y-4">
            <AnimatePresence>
            {sessions.map((session, index) => {
              const isLive = session.status === 'LIVE';
              const isCompleted = session.status === 'COMPLETED';
              const isUpcoming = session.status === 'UPCOMING';

              return (
                <motion.div 
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
                  className={`relative flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 ${isLive ? 'bg-gradient-to-r from-red-950/80 to-f1red/20 border-f1red shadow-[0_4px_30px_rgba(225,6,0,0.25)] scale-[1.03] z-10' : isCompleted ? 'bg-gray-900/40 border-gray-800 opacity-60' : 'bg-gray-900/80 border-gray-700 hover:border-gray-500 shadow-md'}`}
                >
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center w-16 text-center">
                      <span className="text-3xl font-black text-gray-200">{new Date(session.timestamp).getDate()}</span>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{new Date(session.timestamp).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div className={`w-[2px] h-12 rounded-full ${isLive ? 'bg-f1red' : isCompleted ? 'bg-gray-700' : 'bg-gray-600'}`}></div>
                    <div className="flex flex-col">
                      <span className={`font-bold text-2xl ${isLive ? 'text-white' : 'text-gray-200'}`}>{session.name}</span>
                      <span className="text-sm font-mono text-gray-400 mt-2 flex items-center gap-2">
                         {isCompleted ? <CheckCircle size={16} className="text-green-500" /> : <Clock size={16} className={isLive ? 'text-f1red' : ''} />} 
                         {session.time ? new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                         {isUpcoming && <span className="ml-3 text-f1red font-bold p-1 bg-red-900/30 rounded px-2">IN: {formatCountdown(session.timestamp)}</span>}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <button 
                      onClick={handleWatch}
                      className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all focus:outline-none 
                        ${isLive ? 'bg-f1red text-white shadow-[0_0_20px_rgba(225,6,0,0.5)] hover:bg-red-600 hover:scale-105 active:scale-95' 
                        : isCompleted ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700/50' 
                        : 'bg-green-600 hover:bg-green-500 text-white shadow hover:scale-105 active:scale-95'}`}
                    >
                      <span>{isLive ? 'Watch FanCode' : isCompleted ? 'Highlights' : 'Remind Me'}</span>
                      <PlayCircle size={20} className={isLive ? 'animate-pulse' : ''} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </div>
        </div>

        {/* LIVE DATA PANEL */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-black/60 backdrop-blur-md rounded-3xl border border-gray-800 p-6 shadow-2xl h-full min-h-[500px]">
            <h3 className="text-xl font-bold mb-6 flex items-center justify-between text-white uppercase tracking-wider relative">
              <span className="flex items-center gap-2"><Trophy className="text-yellow-500" size={20}/> Live Positions</span>
              {isDataLoading && <Activity size={16} className="animate-spin text-f1red" />}
            </h3>
            
            {!sessions.some(s => s.status === 'LIVE') ? (
               <div className="h-full flex flex-col items-center justify-center opacity-50 pt-20">
                 <Activity size={48} className="mb-4 text-gray-600" />
                 <p className="text-center text-gray-400 font-mono tracking-wide uppercase text-sm">Telemetry offline.<br/>Waiting for live session.</p>
               </div>
            ) : liveData.length === 0 ? (
               <div className="h-full flex items-center justify-center p-8">
                 <p className="text-gray-400 font-mono text-sm animate-pulse">Initializing Telemetry Link...</p>
               </div>
            ) : (
               <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50">
                 <div className="grid grid-cols-12 gap-2 font-mono text-xs font-bold text-gray-500 uppercase tracking-widest bg-black/50 p-3 border-b border-gray-800">
                    <div className="col-span-2 text-center">Pos</div>
                    <div className="col-span-10">Driver</div>
                 </div>
                 <div className="max-h-[500px] overflow-y-auto no-scrollbar pb-2">
                   <AnimatePresence>
                     {liveData.map((d, i) => (
                       <motion.div 
                         key={d.driver_number} 
                         initial={{ opacity: 0, x: 20 }}
                         animate={{ opacity: 1, x: 0 }}
                         transition={{ delay: i * 0.05 }}
                         className="grid grid-cols-12 gap-2 items-center p-3 border-b border-gray-800/30 hover:bg-gray-800 transition-colors"
                       >
                         <div className="col-span-2 text-center font-black text-lg text-white">{d.position || i+1}</div>
                         <div className="col-span-10 flex items-center justify-between">
                            <span className="font-bold text-gray-200 tracking-wide uppercase">{d.driver_number || 'DRV'}</span>
                         </div>
                       </motion.div>
                     ))}
                   </AnimatePresence>
                 </div>
               </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
