import axios from 'axios';

const BASE_URL = 'https://api.openf1.org/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.response.use(undefined, (err) => {
  // Simple retry logic on failure
  const config = err.config;
  if (!config || !config.retry) return Promise.reject(err);
  config.retry -= 1;
  return new Promise(resolve => setTimeout(() => resolve(apiClient(config)), 1000));
});

export const getLatestSession = async () => {
  try {
    const res = await apiClient.get('/sessions?session_key=latest', { retry: 3 });
    return res.data?.[0] || null;
  } catch (err) {
    console.error("OpenF1 API Latest Session Error:", err);
    return null;
  }
}

export const getLiveTelemetry = async () => {
  try {
    // Parallel fetch of positions and intervals
    const [posRes, intRes] = await Promise.all([
      apiClient.get('/position?session_key=latest', { retry: 2 }),
      apiClient.get('/intervals?session_key=latest', { retry: 2 })
    ]);

    const positions = posRes.data || [];
    const intervals = intRes.data || [];

    // Map latest position per driver
    const latestPositions = {};
    positions.forEach(p => {
      if (!latestPositions[p.driver_number] || latestPositions[p.driver_number].date < p.date) {
        latestPositions[p.driver_number] = { ...p };
      }
    });

    // Map latest interval per driver
    const latestIntervals = {};
    intervals.forEach(i => {
      if (!latestIntervals[i.driver_number] || latestIntervals[i.driver_number].date < i.date) {
        latestIntervals[i.driver_number] = { ...i };
      }
    });

    // Combine
    return Object.values(latestPositions).map(driver => ({
      position: driver.position,
      driver_number: driver.driver_number,
      date: driver.date,
      gap_to_leader: latestIntervals[driver.driver_number]?.gap_to_leader || '+0.000',
      interval: latestIntervals[driver.driver_number]?.interval || '+0.000',
    })).sort((a,b) => a.position - b.position);

  } catch (error) {
    console.error("Error fetching live telemetry:", error);
    return [];
  }
};
