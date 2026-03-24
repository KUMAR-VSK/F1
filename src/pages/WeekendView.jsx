import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Clock, CheckCircle, Activity, Youtube, ExternalLink } from 'lucide-react';
import { getCurrentWeekend } from '../services/sessionService';

export default function WeekendView() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('f1_last_opened', 'weekend');

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

  const handleWatch = (url) => {
    if (window.electron && window.electron.openFanCode) {
      if(url === 'fancode') window.electron.openFanCode();
      else window.open(url, '_blank');
    } else {
      window.open(url === 'fancode' ? 'https://www.fancode.com/formula1' : url, '_blank');
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

      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* SESSIONS TIMELINE */}
        <div className="lg:col-span-7 bg-gray-900/60 backdrop-blur-md rounded-3xl border border-gray-800 p-8 shadow-2xl">
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
                      onClick={() => handleWatch('fancode')}
                      className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all focus:outline-none 
                        ${isLive ? 'bg-f1red text-white shadow-[0_0_20px_rgba(225,6,0,0.5)] hover:bg-red-600 hover:scale-105' 
                        : isCompleted ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700/50' 
                        : 'bg-green-600 hover:bg-green-500 text-white shadow hover:scale-105'}`}
                    >
                      <span>{isLive ? 'Watch FanCode' : isCompleted ? 'Official Stream' : 'Remind Me'}</span>
                      <PlayCircle size={20} className={isLive ? 'animate-pulse' : ''} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </div>
        </div>

        {/* OFFICIAL HIGHLIGHTS */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-gray-900/60 backdrop-blur-md rounded-3xl border border-gray-800 p-8 shadow-2xl h-full min-h-[500px]">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-white uppercase tracking-wider relative border-b border-gray-800 pb-4">
              <Youtube className="text-red-500" size={24}/> Official Highlights
            </h3>
            
            <div className="space-y-6">
              {[
                { name: 'Race Highlights', type: 'Race', available: sessions.find(s => s.id === 'Race')?.status === 'COMPLETED' },
                { name: 'Qualifying Highlights', type: 'Qualifying', available: sessions.find(s => s.id === 'Qualifying')?.status === 'COMPLETED' },
                { name: 'Practice Highlights', type: 'FirstPractice', available: sessions.find(s => s.id === 'FirstPractice')?.status === 'COMPLETED' }
              ].map((hl, i) => (
                <div key={i} className="bg-black/40 rounded-2xl p-6 border border-gray-800 shadow-md flex items-center justify-between group transition-colors hover:bg-black/60">
                  <div>
                    <h4 className="font-bold text-lg text-gray-200 uppercase tracking-wide">{hl.name}</h4>
                    <p className="text-xs font-mono text-gray-500 mt-2 flex items-center gap-1">
                      {hl.available ? <span className="text-green-500 flex items-center gap-1"><CheckCircle size={12}/> Ready to watch</span> : <span>Processing video...</span>}
                    </p>
                  </div>
                  <div>
                    <button 
                      onClick={() => handleWatch('https://www.youtube.com/@Formula1')}
                      disabled={!hl.available}
                      className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all ${hl.available ? 'bg-gray-800 text-white hover:bg-f1red hover:text-white hover:scale-110 shadow-lg' : 'bg-gray-800/30 text-gray-600 cursor-not-allowed border border-gray-800'}`}
                    >
                      {hl.available ? <PlayCircle size={24} /> : <Clock size={24} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-red-900/10 border border-red-900/30 rounded-xl text-center">
               <p className="text-xs text-gray-400 leading-relaxed font-mono">
                 All highlights redirect to the <span className="text-gray-300 font-bold">Official F1 YouTube Channel</span>. For full replays, please access <a href="#" onClick={() => handleWatch('https://f1tv.formula1.com')} className="text-f1red underline inline-flex items-center gap-1 hover:text-red-400">F1 TV <ExternalLink size={10}/></a> or FanCode.
               </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
