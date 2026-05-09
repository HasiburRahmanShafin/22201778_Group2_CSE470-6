const Location = require('../models/Location');
const Report = require('../models/Report');
const riverStations = require('../../data/riverStationsDetailed.json');
const { fetchRecentEarthquakes } = require('./usgsService');

const coastalDistricts = ['Barguna', 'Bhola', 'Patuakhali', "Cox's Bazar", 'Noakhali', 'Satkhira', 'Khulna'];

// Simple distance (km) using Haversine formula
function distance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// ------------------------------------------------------------------
// Risk calculation for a single upazila (uses cached earthquakes)
// ------------------------------------------------------------------
async function computeRiskForUpazila(upazila, earthquakes) {
  let score = 0;

  // 1. Seismic zone
  if (upazila.seismicZone === 'high') score += 55;
  else if (upazila.seismicZone === 'moderate') score += 40;
  else score += 25;

  // 2. Flood proneness
  if (upazila.floodProne) score += 45;

  // 3. Coastal proximity
  if (upazila.parent) {
    const district = await Location.findById(upazila.parent);
    if (district && coastalDistricts.includes(district.name)) score += 20;
  }

  // 4. River level exceedance
  const station = riverStations.find(s => s.upazila === upazila.name);
  if (station && station.currentLevel > station.dangerLevel) {
    const d = station.currentLevel / station.dangerLevel;
    const exceed = Math.min(70, (d) * 100);
    score += exceed;
  }

  // 5. Rainfall trend
  if (station && station.upstreamRainfall) {
    const rain = Math.min(30, station.upstreamRainfall);
    score += rain;
  }

  // 6. Earthquake impact (using pre‑fetched earthquakes)
  const upLat = parseFloat(upazila.lat);
  const upLng = parseFloat(upazila.long);
  if (earthquakes && !isNaN(upLat) && !isNaN(upLng)) {
    for (const q of earthquakes) {
      let eqLat, eqLng;
      if (q.epicenter) {
        eqLat = q.epicenter.lat;
        eqLng = q.epicenter.lng;
      } else if (q.lat && q.lng) {
        eqLat = q.lat;
        eqLng = q.lng;
      } else continue;
      if (distance(upLat, upLng, eqLat, eqLng) < 100) {
        if (q.magnitude >= 5.5) score += 35;
        else if (q.magnitude >= 4.5) score += 20;
        else if (q.magnitude >= 3.0) score += 15;
        break; // only add once for the nearest? we add only the first match (simplified)
      }
    }
  }

  // 7. Citizen reports (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const reportsCount = await Report.countDocuments({
    upazila: upazila.name,
    status: 'approved',
    createdAt: { $gte: sevenDaysAgo }
  });
  score += Math.min(50, reportsCount * 20);

  return Math.min(100, score);
}

// ------------------------------------------------------------------
// District risk = average of its upazilas
// ------------------------------------------------------------------
async function computeRiskForDistrict(district, upazilaRiskMap) {
  const upazilas = await Location.find({ parent: district._id, type: 'upazila' });
  if (upazilas.length === 0) return 0;
  let total = 0;
  for (const up of upazilas) {
    total += upazilaRiskMap.get(up._id.toString()) || 0;
  }
  return Math.round(total / upazilas.length);
}

// ------------------------------------------------------------------
// Main update function – fetches earthquakes ONCE
// ------------------------------------------------------------------
async function updateAllRiskScores() {
  console.log('🔄 Starting risk score update...');

  // 1. Fetch earthquakes once (cached inside usgsService if you want, but here we just call it once)
  let earthquakes = [];
  try {
    earthquakes = await fetchRecentEarthquakes();
    console.log(`📊 Fetched ${earthquakes.length} recent earthquakes`);
  } catch (err) {
    console.error('Failed to fetch earthquakes, continuing without quake contribution', err);
  }

  // 2. Update all upazilas and collect their risk scores in a map
  const upazilas = await Location.find({ type: 'upazila' });
  console.log(`📊 Found ${upazilas.length} upazilas`);
  const upazilaRiskMap = new Map();
  let count = 0;

  for (const up of upazilas) {
    try {
      const newRisk = await computeRiskForUpazila(up, earthquakes);
      up.riskScore = newRisk;
      await up.save();
      upazilaRiskMap.set(up._id.toString(), newRisk);
      count++;
      if (count % 50 === 0) console.log(`   Updated ${count} upazilas`);
    } catch (err) {
      console.error(`❌ Error updating upazila ${up.name}:`, err.message);
    }
  }
  console.log(`✅ Updated risk scores for ${count} upazilas`);

  // 3. Update districts using the aggregated upazila risks
  const districts = await Location.find({ type: 'district' });
  console.log(`📊 Found ${districts.length} districts`);
  let distCount = 0;
  for (const dist of districts) {
    try {
      const districtRisk = await computeRiskForDistrict(dist, upazilaRiskMap);
      dist.riskScore = districtRisk;
      await dist.save();
      distCount++;
      if (distCount % 20 === 0) console.log(`   Updated ${distCount} districts`);
    } catch (err) {
      console.error(`❌ Error updating district ${dist.name}:`, err.message);
    }
  }
  console.log(`✅ Updated risk scores for ${distCount} districts`);
}

module.exports = { updateAllRiskScores };