import { getRaceSchedule } from './ergastService';

export const getCurrentWeekend = async () => {
  const schedule = await getRaceSchedule();
  if (!schedule || schedule.length === 0) return null;

  const now = new Date();
  
  // Find the closest race overall
  // A weekend is considered current from Monday before to Wednesday after
  let currentRace = schedule.find(race => {
    const raceDate = new Date(`${race.date}T${race.time || '00:00:00Z'}`);
    const timeDiff = raceDate.getTime() - now.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return daysDiff > -3 && daysDiff < 10; 
  });

  if (!currentRace) {
    // If none currently matching, find next upcoming race
    currentRace = schedule.find(race => new Date(`${race.date}T${race.time || '00:00:00Z'}`) > now);
  }

  // Fallback to last race if season is over
  if (!currentRace) currentRace = schedule[schedule.length - 1];

  return formatWeekendSessions(currentRace);
};

const formatWeekendSessions = (race) => {
  if (!race) return [];
  const sessions = [];

  const addSession = (name, dataKey) => {
    if (race[dataKey]) {
      sessions.push({
        id: dataKey,
        name: name,
        date: race[dataKey].date,
        time: race[dataKey].time,
        timestamp: new Date(`${race[dataKey].date}T${race[dataKey].time || '00:00:00Z'}`).getTime()
      });
    }
  };

  addSession('Practice 1', 'FirstPractice');
  addSession('Practice 2', 'SecondPractice');
  addSession('Practice 3', 'ThirdPractice');
  addSession('Sprint Shootout / Quali', 'SprintQualifying');
  addSession('Sprint', 'Sprint');
  addSession('Qualifying', 'Qualifying');
  
  // Add Main Race
  sessions.push({
    id: 'Race',
    name: 'Main Race',
    date: race.date,
    time: race.time,
    timestamp: new Date(`${race.date}T${race.time || '00:00:00Z'}`).getTime()
  });

  // Sort chronologically
  return sessions.sort((a, b) => a.timestamp - b.timestamp).map((session, idx, arr) => {
    const now = new Date().getTime();
    
    // Live detection (Assume a session lasts ~2 hours)
    const isLive = now >= session.timestamp && now <= session.timestamp + (2 * 3600 * 1000);
    const isPast = now > session.timestamp + (2 * 3600 * 1000);
    const isNext = !isPast && !isLive && (idx === 0 || arr[idx-1].timestamp < now);

    return {
      ...session,
      raceName: race.raceName,
      circuit: race.Circuit?.circuitName,
      status: isLive ? 'LIVE' : isPast ? 'COMPLETED' : 'UPCOMING',
      isNext
    };
  });
};
