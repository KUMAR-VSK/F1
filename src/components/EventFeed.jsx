import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Activity } from 'lucide-react';

export default function EventFeed({ feed, sessionInfo }) {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4 hover:[animation-play-state:paused] relative">
      {!sessionInfo ? (
         <div className="flex h-full items-center justify-center opacity-30 text-xs font-mono text-center px-4 uppercase tracking-widest">
            Live Feed Unavailable until session starts
         </div>
      ) : feed.length === 0 ? (
         <div className="text-gray-500 font-mono text-sm my-4 text-center">Monitoring telemetry...</div>
      ) : (
        <AnimatePresence>
          {feed.map(event => (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={event.id}
              className={`p-4 rounded-xl border font-mono text-sm leading-relaxed shadow-lg
                ${event.type === 'overtake' ? 'bg-green-900/20 border-green-800/50 text-green-400' 
                : event.type === 'drop' ? 'bg-red-900/10 border-red-900/30 text-gray-400' 
                : event.type === 'pit' ? 'bg-blue-900/20 border-blue-800/50 text-blue-300'
                : event.type === 'flag' ? 'bg-yellow-900/20 border-yellow-800/50 text-yellow-500' 
                : 'bg-gray-800/40 border-gray-700 text-gray-300'}`}
            >
              <div className="text-[10px] uppercase font-black tracking-widest mb-1 opacity-70 flex items-center gap-2">
                 <Timer size={10} /> {event.time}
                 {event.type === 'pit' && <span className="ml-auto text-blue-400">PIT STOP</span>}
                 {event.type === 'flag' && <span className="ml-auto text-yellow-500 flex items-center gap-1"><Activity size={10}/> RACE CONTROL</span>}
              </div>
              {event.text}
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
