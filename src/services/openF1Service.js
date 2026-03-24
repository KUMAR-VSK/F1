import axios from 'axios';

const BASE_URL = 'https://api.openf1.org/v1';

export const getLatestSession = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/sessions?session_key=latest`);
    return res.data[0];
  } catch (err) {
    console.error(err);
    return null;
  }
}

export const getLivePositions = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/position?session_key=latest`);
    // OpenF1 returns many position entries over time. 
    // We filter for the latest state of each driver.
    const positions = res.data;
    const latestPositions = {};
    positions.forEach(p => {
      if (!latestPositions[p.driver_number] || latestPositions[p.driver_number].date < p.date) {
        latestPositions[p.driver_number] = p;
      }
    });
    return Object.values(latestPositions).sort((a,b) => a.position - b.position);
  } catch (error) {
    console.error("Error fetching live positions", error);
    return [];
  }
};
