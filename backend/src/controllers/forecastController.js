const riverStations = require('../../data/riverStationsDetailed.json');

exports.getFloodForecast = (req, res) => {
  const forecast = riverStations.map(station => ({
    upazila: station.upazila,
    currentLevel: station.currentLevel,
    forecast24h: Number((station.currentLevel + (station.upstreamRainfall / 100) + (station.trend === 'rising' ? 0.3 : 0)).toFixed(2)),
    forecast48h: Number((station.currentLevel + (station.upstreamRainfall / 50) + (station.trend === 'rising' ? 0.6 : 0)).toFixed(2)),
    riskLevel: station.currentLevel + 0.8 > station.dangerLevel ? 'high' : (station.currentLevel + 0.3 > station.dangerLevel ? 'medium' : 'low')
  }));
  res.json(forecast);
};