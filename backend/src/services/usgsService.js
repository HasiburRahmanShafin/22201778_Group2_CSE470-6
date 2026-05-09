const axios = require('axios');

let earthquakeCache = null;
let lastFetchTime = null;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

async function fetchRecentEarthquakes() {
  // Return cached data if still fresh
  if (earthquakeCache && lastFetchTime && (Date.now() - lastFetchTime) < CACHE_TTL) {
    console.log('Using cached earthquake data');
    return earthquakeCache;
  }

  // Use last 7 days (reduce load and avoid rate limit)
  const oneWeekAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString();
  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${oneWeekAgo}&minlatitude=20.5&maxlatitude=26.5&minlongitude=88.0&maxlongitude=92.5&minmagnitude=4.0`;

  // Retry up to 3 times with exponential backoff
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await axios.get(url, { timeout: 10000 });
      const earthquakes = response.data.features.map(f => ({
        magnitude: f.properties.mag,
        depth: f.geometry.coordinates[2],
        epicenter: {
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0]
        },
        place: f.properties.place,
        time: new Date(f.properties.time)
      }));
      earthquakeCache = earthquakes;
      lastFetchTime = Date.now();
      return earthquakes;
    } catch (error) {
      if (error.response && error.response.status === 429 && attempt < 3) {
        const waitTime = attempt * 2000; // 2s, 4s
        console.log(`USGS rate limit (429) – retry in ${waitTime}ms (attempt ${attempt}/3)`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      console.error('USGS fetch error:', error.message);
      return []; // Return empty on final failure
    }
  }
  return [];
}

module.exports = { fetchRecentEarthquakes };