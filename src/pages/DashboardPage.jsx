import { useState, useEffect } from 'react';
import { getRaceSchedule } from '../services/ergastService';

export default function DashboardPage() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRaceSchedule().then(data => {
      setSchedule(data);
      setLoading(false);
    });
  }, []);

  // Find next race
  const now = new Date();
  const nextRace = schedule.find(race => new Date(`${race.date}T${race.time || '00:00:00Z'}`) > now);

  return (
    <div className="p-8 h-full overflow-y-auto pb-10">
      <h2 className="text-3xl font-bold tracking-tight mb-8">Dashboard</h2>
      
      {nextRace && (
        <div className="bg-gradient-to-r from-card to-darker rounded-2xl p-8 mb-10 border border-gray-800 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>
          </div>
          <p className="text-f1red font-bold tracking-widest uppercase text-sm mb-2 drop-shadow-md">Next Race</p>
          <h3 className="text-4xl font-bold mb-2">{nextRace.raceName}</h3>
          <p className="text-xl text-gray-400 mb-6">{nextRace.Circuit.circuitName}, {nextRace.Circuit.Location.country}</p>
          
          <div className="flex gap-4">
            <div className="bg-darker px-4 py-2 rounded-xl border border-gray-800 shadow-inner">
              <p className="text-xs text-gray-500 uppercase">Date</p>
              <p className="font-mono text-lg">{new Date(nextRace.date).toLocaleDateString()}</p>
            </div>
            {nextRace.time && (
              <div className="bg-darker px-4 py-2 rounded-xl border border-gray-800 shadow-inner">
                <p className="text-xs text-gray-500 uppercase">Time</p>
                <p className="font-mono text-lg">{new Date(`${nextRace.date}T${nextRace.time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <h3 className="text-2xl font-bold mb-6 tracking-wide">Season Calendar</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-10 text-center text-gray-500">
            <p className="animate-pulse">Loading schedule...</p>
          </div>
        ) : (
          schedule.map((race) => {
            const isPast = new Date(`${race.date}T${race.time || '00:00:00Z'}`) < now;
            
            return (
              <div key={race.round} className={`bg-card rounded-2xl p-6 border transition-all ${isPast ? 'border-gray-800 opacity-60' : 'border-gray-700 hover:border-gray-500 shadow-xl'}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-f1red font-mono bg-f1red/10 px-2 py-1 rounded text-sm font-bold shadow-sm">Round {race.round}</span>
                  <span className={`text-xs px-2 py-1 rounded uppercase tracking-wider font-semibold ${isPast ? 'bg-gray-800 text-gray-400' : 'bg-green-900/40 text-green-400 border border-green-900/50 shadow-sm'}`}>
                    {isPast ? 'Completed' : 'Upcoming'}
                  </span>
                </div>
                <h4 className="font-bold text-lg leading-tight mb-2">{race.raceName}</h4>
                <p className="text-sm text-gray-400 mb-4 h-5">{race.Circuit.circuitName}</p>
                <div className="font-mono text-sm text-gray-300 bg-darker p-3 rounded-xl border border-gray-800/50 flex justify-between items-center shadow-inner">
                  <span>{new Date(`${race.date}T${race.time || '00:00:00Z'}`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  {race.time && <span className="text-gray-500">{new Date(`${race.date}T${race.time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
