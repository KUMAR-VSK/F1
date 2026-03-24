import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentWeekend } from '../services/sessionService';

export default function WeekendView() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentWeekend()
      .then(data => {
        setSessions(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setSessions([]);
        setLoading(false);
      });
  }, []);

  const handleWatch = (session) => {
    navigate('/', { state: { sessionId: session.id, sessionName: session.name, autoPlay: true } });
  };

  if (loading) return <div className="p-8 h-full flex flex-col items-center justify-center"><p className="text-f1red animate-pulse font-bold tracking-widest uppercase text-xl">Loading Weekend Timeline...</p></div>;
  if (!sessions.length) return <div className="p-8 h-full flex items-center justify-center text-gray-500 font-bold tracking-wider uppercase">No active weekend data found.</div>;

  return (
    <div className="p-8 h-full overflow-y-auto pb-12 flex flex-col max-w-5xl mx-auto w-full">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight mb-2 uppercase text-white drop-shadow-md">{sessions[0]?.raceName}</h2>
        <p className="text-xl text-gray-400 font-medium tracking-wide">{sessions[0]?.circuit}</p>
      </div>

      <div className="flex-1 w-full bg-card rounded-3xl border border-gray-800 p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none transform translate-x-4">
          <svg width="240" height="240" viewBox="0 0 24 24" fill="currentColor"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>
        </div>

        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
          Session Timeline
          {sessions.some(s => s.status === 'LIVE') && (
            <span className="bg-f1red text-white text-xs font-black uppercase px-3 py-1 rounded shadow shadow-f1red/50 animate-pulse">Live Now</span>
          )}
        </h3>

        <div className="space-y-4">
          {sessions.map((session, index) => {
            const isLive = session.status === 'LIVE';
            const isCompleted = session.status === 'COMPLETED';

            return (
              <motion.div 
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${isLive ? 'bg-gradient-to-r from-red-900/40 to-f1red/10 border-f1red/50 shadow-lg shadow-f1red/20 scale-[1.02]' : isCompleted ? 'bg-darker/50 border-gray-800/50 opacity-70' : 'bg-darker border-gray-700 hover:border-gray-500 hover:bg-gray-800/80 shadow-md'}`}
              >
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center w-12 text-center">
                    <span className="text-2xl font-black text-gray-300">{new Date(session.timestamp).getDate()}</span>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{new Date(session.timestamp).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div className="w-px h-10 bg-gray-700/50"></div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xl">{session.name}</span>
                    <span className="text-sm font-mono text-gray-400 mt-1 flex items-center gap-2">
                       {isCompleted ? <CheckCircle size={14} className="text-green-500" /> : <Clock size={14} />} 
                       {session.time ? new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleWatch(session)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all focus:outline-none ${isLive ? 'bg-f1red text-white shadow shadow-f1red/50 hover:bg-red-600' : isCompleted ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700/50' : 'bg-green-600 hover:bg-green-500 text-white shadow shadow-green-600/30 text-white'}`}
                  >
                     {isLive ? 'Watch Live' : isCompleted ? 'Replay' : 'Coming Up'} 
                     <PlayCircle size={18} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
