const axios = require('axios');

async function fetchRecentEarthquakes() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${oneDayAgo}&minlatitude=20.5&maxlatitude=26.5&minlongitude=88.0&maxlongitude=92.5&minmagnitude=4.5`;
  try {
    const response = await axios.get(url);
    return response.data.features.map(f => ({
      magnitude: f.properties.mag,
      place: f.properties.place,
      time: new Date(f.properties.time),
      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0]
    }));
  } catch (error) {
    console.error('USGS fetch error:', error.message);
    return [];
  }
}

module.exports = { fetchRecentEarthquakes };