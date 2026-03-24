import axios from 'axios';

const BASE_URL = 'https://ergast.com/api/f1';

export const getRaceSchedule = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/current.json`);
    return res.data.MRData.RaceTable.Races;
  } catch (error) {
    console.error("Error fetching schedule", error);
    return [];
  }
};

export const getDriverStandings = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/current/driverStandings.json`);
    return res.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
  } catch (error) {
    console.error("Error fetching driver standings", error);
    return [];
  }
};

export const getConstructorStandings = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/current/constructorStandings.json`);
    return res.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
  } catch (error) {
    console.error("Error fetching constructor standings", error);
    return [];
  }
};

export const getDriverImage = async (wikiUrl) => {
  try {
    const title = wikiUrl.split('/wiki/')[1];
    if (!title) return null;
    const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${title}`);
    return res.data.thumbnail?.source || null;
  } catch (error) {
    console.error("Error fetching driver image", error);
    return null;
  }
};
