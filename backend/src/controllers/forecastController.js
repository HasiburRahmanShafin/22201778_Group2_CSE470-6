const RiverStation = require('../models/RiverStation');

exports.getFloodForecast = async (req, res) => {
  try {
    const stations = await RiverStation.find();
    const forecast = stations.map(station => {
      // Calculate 24h and 48h forecasts using the same logic as before
      const forecast24h = Number((station.currentLevel + (station.upstreamRainfall / 100) + (station.trend === 'rising' ? 0.3 : 0)).toFixed(2));
      const forecast48h = Number((station.currentLevel + (station.upstreamRainfall / 50) + (station.trend === 'rising' ? 0.6 : 0)).toFixed(2));
      // Determine risk level based on forecast (as before)
      const riskLevel = (station.currentLevel + 0.8) > station.dangerLevel ? 'high' : ((station.currentLevel + 0.3) > station.dangerLevel ? 'medium' : 'low');
      return {
        upazila: station.upazila,
        currentLevel: station.currentLevel,
        forecast24h,
        forecast48h,
        riskLevel,
        dangerLevel: station.dangerLevel   // included for frontend reference
      };
    });
    res.json(forecast);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};