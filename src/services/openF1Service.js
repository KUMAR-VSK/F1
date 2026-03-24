import axios from 'axios';

const BASE_URL = 'https://api.openf1.org/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.response.use(undefined, (err) => {
  const config = err.config;
  if (!config || !config.retry) return Promise.reject(err);
  config.retry -= 1;
  return new Promise(resolve => setTimeout(() => resolve(apiClient(config)), 1000));
});

let cachedDrivers = null;

export const getSessionDrivers = async () => {
  if (cachedDrivers) return cachedDrivers;
  try {
    const res = await apiClient.get('/drivers?session_key=latest', { retry: 3 });
    const drivers = {};
    res.data.forEach(d => {
      drivers[d.driver_number] = d;
    });
    cachedDrivers = drivers;
    return drivers;
  } catch (err) {
    console.error("Error fetching drivers:", err);
    return {};
  }
};

export const getLiveTelemetry = async () => {
  try {
    const driversMap = await getSessionDrivers();

    const [posRes, intRes, pitRes, flagRes, lapRes] = await Promise.all([
      apiClient.get('/position?session_key=latest', { retry: 2 }),
      apiClient.get('/intervals?session_key=latest', { retry: 2 }),
      apiClient.get('/pit?session_key=latest', { retry: 1 }),
      apiClient.get('/race_control?session_key=latest', { retry: 1 }),
      apiClient.get('/laps?session_key=latest', { retry: 1 })
    ]);

    const positions = posRes.data || [];
    const intervals = intRes.data || [];
    const pits = pitRes.data || [];
    const flags = flagRes.data || [];
    const laps = lapRes.data || [];

    // Map latest position
    const latestPositions = {};
    positions.forEach(p => {
      if (!latestPositions[p.driver_number] || latestPositions[p.driver_number].date < p.date) {
        latestPositions[p.driver_number] = { ...p };
      }
    });

    // Map latest interval
    const latestIntervals = {};
    intervals.forEach(i => {
      if (!latestIntervals[i.driver_number] || latestIntervals[i.driver_number].date < i.date) {
        latestIntervals[i.driver_number] = { ...i };
      }
    });

    // Determine current lap from laps data
    let currentLap = 0;
    laps.forEach(l => {
      if (l.lap_number > currentLap) currentLap = l.lap_number;
    });

    // Get current track status (Flags)
    let currentFlag = 'GREEN';
    if (flags.length > 0) {
       // Get the latest flag event
       const latestFlagEvent = flags.sort((a,b) => new Date(b.date) - new Date(a.date))[0];
       if (latestFlagEvent.flag) currentFlag = latestFlagEvent.flag;
    }

    // Combine driver data
    const telemetryData = Object.values(latestPositions).map(driver => {
      const dNum = driver.driver_number;
      const driverInfo = driversMap[dNum] || {};
      
      return {
        position: driver.position,
        driver_number: dNum,
        name_acronym: driverInfo.name_acronym || `DRV${dNum}`,
        full_name: driverInfo.full_name || `Driver ${dNum}`,
        team_name: driverInfo.team_name || 'Unknown',
        team_colour: driverInfo.team_colour || 'ffffff',
        gap_to_leader: latestIntervals[dNum]?.gap_to_leader || '+0.000',
        interval: latestIntervals[dNum]?.interval || '+0.000',
      }
    }).sort((a, b) => a.position - b.position);

    return {
      telemetry: telemetryData,
      currentLap,
      currentFlag,
      pits,
      flags
    };

  } catch (error) {
    console.error("Error fetching live telemetry:", error);
    return { telemetry: [], currentLap: 0, currentFlag: 'UNKNOWN', pits: [], flags: [] };
  }
};
