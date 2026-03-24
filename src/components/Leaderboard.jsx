import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, AlertTriangle } from 'lucide-react';

export default function Leaderboard({ telemetry, sessionInfo }) {
  if (!sessionInfo) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
        <AlertTriangle size={48} className="text-gray-500 mb-4" />
        <span className="text-gray-400 font-mono tracking-widest uppercase">Telemetry Offline</span>
      </div>
    );
  }

  if (telemetry.length === 0) {
    return <div className="font-mono text-center pt-20 text-gray-500 animate-pulse">Waiting for cars on track...</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar relative p-2">
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
              className={`grid grid-cols-12 gap-3 items-center p-3 my-1 rounded-xl transition-colors
                ${isTop3 ? 'bg-gradient-to-r from-gray-800/80 to-transparent border border-gray-700/50' : 'hover:bg-gray-800/40 border border-transparent'}`}
            >
              <div className="col-span-2 flex items-center justify-center">
                 <span className="text-xl font-bold font-mono text-white text-center">
                   {driver.position}
                 </span>
                 {driver.position === 1 && <Trophy size={14} className="text-yellow-500 ml-1"/>}
              </div>
              
              <div className="col-span-1 flex items-center justify-center">
                <div 
                  className="w-1.5 h-full rounded" 
                  style={{ backgroundColor: `#${driver.team_colour}` }}
                />
              </div>

              <div className="col-span-5 flex flex-col justify-center">
                <span className="font-black tracking-wider text-gray-200 uppercase text-sm leading-none">
                  {driver.name_acronym} <span className="text-gray-500 text-xs ml-1">{driver.driver_number}</span>
                </span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest truncate">
                  {driver.team_name}
                </span>
              </div>

              <div className="col-span-2 text-right font-mono text-xs text-gray-300 font-bold flex flex-col justify-center">
                {driver.position === 1 ? 'Leader' : driver.gap_to_leader}
              </div>
              <div className="col-span-2 text-right font-mono text-[10px] text-gray-500 flex flex-col justify-center">
                 {driver.position === 1 ? '-' : driver.interval}
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  );
}
