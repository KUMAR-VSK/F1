import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Trophy, Timer, Radio, AlertTriangle } from 'lucide-react';
import { getLiveTelemetry } from '../services/openF1Service';
import { getCurrentWeekend } from '../services/sessionService';

export default function LiveTelemetry() {
  const [telemetry, setTelemetry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [commentaryFeed, setCommentaryFeed] = useState([]);
  const prevTelemetry = useRef({});

  useEffect(() => {
    localStorage.setItem('f1_last_opened', 'live');
    
    // Check if there is a LIVE session
    const loadInit = async () => {
      const weekend = await getCurrentWeekend();
      const live = weekend?.find(s => s.status === 'LIVE');
      setSessionInfo(live || null);
      
      const cached = localStorage.getItem('f1_telemetry_cache');
      if (cached) setTelemetry(JSON.parse(cached));
      
      setLoading(false);
    };
    loadInit();
  }, []);

  useEffect(() => {
    if (!sessionInfo) return; // Only poll if live session exists

    const fetchTelemetry = async () => {
      const data = await getLiveTelemetry();
      if (!data || data.length === 0) return;
      
      localStorage.setItem('f1_telemetry_cache', JSON.stringify(data));
      
      // Derive commentary from positional changes
      const newEvents = [];
      data.forEach(driver => {
        const dNum = driver.driver_number;
        const prevDriver = prevTelemetry.current[dNum];
        
        if (prevDriver && prevDriver.position > driver.position) {
          const places = prevDriver.position - driver.position;
          newEvents.unshift({
            id: Date.now() + dNum,
            text: `Driver ${dNum} gained ${places} position(s) up to P${driver.position}!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            type: 'overtake'
          });
        } else if (prevDriver && prevDriver.position < driver.position) {
          newEvents.unshift({
            id: Date.now() + dNum,
            text: `Driver ${dNum} dropped to P${driver.position}.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            type: 'drop'
          });
        }
      });
      
      if (newEvents.length > 0) {
        setCommentaryFeed(prev => [...newEvents, ...prev].slice(0, 50));
      }

      data.forEach(d => { prevTelemetry.current[d.driver_number] = d; });
      setTelemetry(data);
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3500); // Poll every 3.5s for rapid live feel
    return () => clearInterval(interval);
  }, [sessionInfo]);

  if (loading) return <div className="h-full flex items-center justify-center text-f1red animate-pulse text-xl uppercase font-black tracking-widest bg-darker"><Activity className="animate-spin mr-3"/> Connecting Telemetry...</div>;

  return (
    <div className="h-full bg-darker p-8 pb-12 overflow-hidden flex flex-col">
      <div className="mb-8 flex items-center justify-between z-10">
        <div>
          <h2 className="text-4xl font-extrabold text-white uppercase tracking-tight flex items-center gap-4">
            Live Telemetry Dashboard
            {sessionInfo && <span className="text-sm bg-f1red text-white px-3 py-1 rounded shadow-lg shadow-f1red/50 animate-pulse flex items-center gap-2"><Radio size={16}/> LIVE</span>}
          </h2>
          <p className="text-gray-400 font-mono tracking-wide mt-2">{sessionInfo ? sessionInfo.raceName + ' - ' + sessionInfo.name : 'Awaiting Next Live Session Data Stream'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        
        {/* LEADERBOARD TABLE */}
        <div className="lg:col-span-8 flex flex-col bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-12 gap-4 p-4 text-xs font-black text-gray-500 uppercase tracking-widest bg-black/60 border-b border-gray-800">
            <div className="col-span-2 text-center">Pos</div>
            <div className="col-span-4">Driver</div>
            <div className="col-span-3 text-right">Gap to Leader</div>
            <div className="col-span-3 text-right text-gray-400">Interval</div>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar relative p-2">
            {!sessionInfo ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
                <AlertTriangle size={48} className="text-gray-500 mb-4" />
                <span className="text-gray-400 font-mono tracking-widest uppercase">Telemetry Offline</span>
              </div>
            ) : telemetry.length === 0 ? (
               <div className="font-mono text-center pt-20 text-gray-500 animate-pulse">Waiting for cars on track...</div>
            ) : (
              <AnimatePresence>
                {telemetry.map((driver) => {
                  const isTop3 = driver.position <= 3;
                  return (
                    <motion.div 
                      key={driver.driver_number}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className={`grid grid-cols-12 gap-4 items-center p-3 my-1 rounded-xl transition-colors
                        ${isTop3 ? 'bg-gradient-to-r from-gray-800/80 to-transparent border border-gray-700/50' : 'hover:bg-gray-800/40 border border-transparent'}`}
                    >
                      <div className="col-span-2 text-center text-xl font-bold font-mono text-white flex items-center justify-center gap-2">
                         {driver.position}
                         {driver.position === 1 && <Trophy size={16} className="text-yellow-500"/>}
                      </div>
                      <div className="col-span-4 font-black uppercase tracking-wider text-gray-200">
                        DRV {driver.driver_number}
                      </div>
                      <div className="col-span-3 text-right font-mono text-sm text-gray-300 font-bold">
                        {driver.position === 1 ? 'Leader' : driver.gap_to_leader}
                      </div>
                      <div className="col-span-3 text-right font-mono text-sm text-gray-500">
                         {driver.position === 1 ? '-' : driver.interval}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* COMMENTARY FEED */}
        <div className="lg:col-span-4 flex flex-col bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="p-5 border-b border-gray-800 bg-black/60 flex items-center justify-between">
            <h3 className="text-white font-bold uppercase tracking-wider flex items-center gap-3">
              <Activity size={18} className="text-f1red"/> Race Control Log
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4 hover:[animation-play-state:paused]">
            {!sessionInfo ? (
               <div className="flex h-full items-center justify-center opacity-30 text-xs font-mono text-center px-4 uppercase tracking-widest">
                  Live Feed Unavailable until session starts
               </div>
            ) : commentaryFeed.length === 0 ? (
               <div className="text-gray-500 font-mono text-sm my-4 text-center">Monitoring telemetry...</div>
            ) : (
              <AnimatePresence>
                {commentaryFeed.map(event => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={event.id}
                    className={`p-4 rounded-xl border font-mono text-sm leading-relaxed shadow-lg
                      ${event.type === 'overtake' ? 'bg-green-900/20 border-green-800/50 text-green-400' 
                      : event.type === 'drop' ? 'bg-red-900/10 border-red-900/30 text-gray-400' 
                      : 'bg-gray-800/40 border-gray-700 text-gray-300'}`}
                  >
                    <div className="text-[10px] uppercase font-black tracking-widest mb-1 opacity-70 flex items-center gap-2">
                       <Timer size={10} /> {event.time}
                    </div>
                    {event.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
          {/* Gradient overlay for smooth scroll fade */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900/90 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
