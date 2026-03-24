import { useState, useEffect } from 'react';
import { getDriverStandings, getConstructorStandings, getDriverImage } from '../services/ergastService';

const DriverAvatar = ({ wikiUrl, fallbackName }) => {
  const [imgSrc, setImgSrc] = useState(null);
  useEffect(() => {
    if (wikiUrl) {
      getDriverImage(wikiUrl).then(url => {
        if (url) setImgSrc(url);
      });
    }
  }, [wikiUrl]);

  return imgSrc ? (
    <img src={imgSrc} alt={fallbackName} className="w-10 h-10 rounded-full object-cover border-2 border-gray-700 shadow-md shrink-0" />
  ) : (
    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-700 shadow-md shrink-0">
      <span className="text-gray-400 font-bold text-xs">{fallbackName.substring(0, 2).toUpperCase()}</span>
    </div>
  );
};

export default function StandingsPage() {
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [activeTab, setActiveTab] = useState('drivers');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDriverStandings(),
      getConstructorStandings()
    ]).then(([d, c]) => {
      setDrivers(d);
      setConstructors(c);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-8 h-full flex flex-col">
      <h2 className="text-3xl font-bold tracking-tight mb-8">Championship Standings</h2>
      
      <div className="flex gap-2 mb-6 p-1.5 bg-darker rounded-xl w-fit border border-gray-800 shadow-inner">
        <button 
          onClick={() => setActiveTab('drivers')}
          className={`px-6 py-2.5 rounded-lg font-bold transition-all text-sm uppercase tracking-wider ${activeTab === 'drivers' ? 'bg-card text-white shadow-md border-gray-700 border' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Drivers
        </button>
        <button 
          onClick={() => setActiveTab('constructors')}
          className={`px-6 py-2.5 rounded-lg font-bold transition-all text-sm uppercase tracking-wider ${activeTab === 'constructors' ? 'bg-card text-white shadow-md border-gray-700 border' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Constructors
        </button>
      </div>

      <div className="flex-1 bg-card rounded-2xl border border-gray-800 overflow-hidden shadow-2xl relative">
        {loading && <div className="absolute inset-0 bg-card/80 flex items-center justify-center z-10 backdrop-blur-sm"><p className="text-f1red animate-pulse font-bold tracking-widest uppercase">Loading Standings...</p></div>}
        
        <div className="overflow-y-auto h-full px-1 custom-scroll">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="sticky top-0 bg-darker z-10">
              <tr className="text-gray-400 text-xs uppercase tracking-widest shadow-md">
                <th className="p-5 font-semibold w-16 text-center border-b border-gray-800">Pos</th>
                {activeTab === 'drivers' && <th className="p-5 font-semibold border-b border-gray-800">Driver</th>}
                <th className="p-5 font-semibold border-b border-gray-800">{activeTab === 'drivers' ? 'Constructor' : 'Team'}</th>
                <th className="p-5 font-semibold text-center border-b border-gray-800">Wins</th>
                <th className="p-5 font-semibold text-right border-b border-gray-800">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {activeTab === 'drivers' ? (
                drivers.map(driver => (
                  <tr key={driver.position} className="hover:bg-gray-800/40 transition-colors group">
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold shadow-sm ${driver.position === '1' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : driver.position === '2' ? 'bg-gray-300/20 text-gray-300 border border-gray-300/30' : driver.position === '3' ? 'bg-orange-700/20 text-orange-500 border border-orange-700/30' : 'text-gray-400 bg-darker'}`}>
                        {driver.position}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <DriverAvatar wikiUrl={driver.Driver.url} fallbackName={driver.Driver.givenName} />
                        <div className="flex flex-col">
                          <span className="font-bold text-lg text-white group-hover:text-f1red transition-colors">{driver.Driver.givenName} {driver.Driver.familyName}</span>
                          <span className="text-xs text-gray-500 font-medium">{driver.Driver.nationality}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{driver.Constructors[0]?.name}</td>
                    <td className="p-4 text-center text-gray-400 font-mono">{driver.wins}</td>
                    <td className="p-4 text-right font-mono font-bold text-xl text-white">{driver.points}</td>
                  </tr>
                ))
              ) : (
                constructors.map(team => (
                  <tr key={team.position} className="hover:bg-gray-800/40 transition-colors group">
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold shadow-sm ${team.position === '1' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : team.position === '2' ? 'bg-gray-300/20 text-gray-300 border border-gray-300/30' : team.position === '3' ? 'bg-orange-700/20 text-orange-500 border border-orange-700/30' : 'text-gray-400 bg-darker'}`}>
                        {team.position}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-white group-hover:text-f1red transition-colors">{team.Constructor.name}</span>
                        <span className="text-xs text-gray-500 font-medium">{team.Constructor.nationality}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center text-gray-400 font-mono">{team.wins}</td>
                    <td className="p-4 text-right font-mono font-bold text-xl text-white">{team.points}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
