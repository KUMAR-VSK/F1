import axios from 'axios';

const BASE_URL = 'https://api.jolpi.ca/ergast/f1'; 

const fetchWithCache = async (url, cacheKey) => {
  const offlineMode = localStorage.getItem('f1_offline_mode') !== 'false';
  
  try {
    const res = await axios.get(url, { timeout: 8000 });
    if (res.data) {
       localStorage.setItem(cacheKey, JSON.stringify(res.data));
       return res.data;
    }
  } catch (error) {
    console.error(`Error fetching ${url}, falling back to cache`, error);
  }

  // Fallback to offline cache
  if (offlineMode) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);
  }
  return null;
}

export const getRaceSchedule = async () => {
  const data = await fetchWithCache(`${BASE_URL}/current.json`, 'f1_cache_schedule');
  return data?.MRData?.RaceTable?.Races || [];
};

export const getDriverStandings = async () => {
  const data = await fetchWithCache(`${BASE_URL}/current/driverStandings.json`, 'f1_cache_driver_standings');
  return data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
};

export const getConstructorStandings = async () => {
  const data = await fetchWithCache(`${BASE_URL}/current/constructorStandings.json`, 'f1_cache_constructor_standings');
  return data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];
};

export const getDriverImage = async (wikiUrl) => {
  if (!wikiUrl) return null;
  const title = wikiUrl.split('/wiki/')[1];
  if (!title) return null;

  const cacheKey = `f1_img_${title}`;
  const offlineMode = localStorage.getItem('f1_offline_mode') !== 'false';

  try {
    const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`, { timeout: 5000 });
    if (res.data?.thumbnail?.source) {
       localStorage.setItem(cacheKey, res.data.thumbnail.source);
       return res.data.thumbnail.source;
    }
  } catch (error) {
    console.error("Error fetching driver image", error);
  }

  if (offlineMode) {
    return localStorage.getItem(cacheKey) || null;
  }
  return null;
};
