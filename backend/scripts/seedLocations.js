const mongoose = require('mongoose');
const Location = require('../src/models/Location');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Load JSON files
const divisionsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bd-divisions.json'), 'utf-8'));
const districtsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bd-districts.json'), 'utf-8'));
const upazilasData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/bd-upazilas.json'), 'utf-8'));

// Extract arrays
const divisions = divisionsData.divisions || divisionsData;
const districts = districtsData.districts || districtsData;
const upazilas = upazilasData.upazilas || upazilasData;

// Helper: safely parse number, return null if invalid
const safeNumber = (value) => {
  if (value === undefined || value === null) return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Location.deleteMany();
    console.log('Cleared existing locations');

    const divisionMap = new Map();

    // 1. Insert divisions (have lat/long)
    console.log(`Seeding ${divisions.length} divisions...`);
    for (const div of divisions) {
      const lat = safeNumber(div.lat);
      const long = safeNumber(div.long);
      const loc = new Location({
        name: div.name,
        bn_name: div.bn_name,
        type: 'division',
        lat: lat,
        long: long,
        riskScore: Math.floor(Math.random() * 100),
        floodProne: ['Dhaka', 'Sylhet', 'Barishal', 'Chattogram'].includes(div.name),
        seismicZone: div.name === 'Sylhet' ? 'high' : (div.name === 'Dhaka' ? 'moderate' : 'low'),
        geometry: (lat && long) ? {
          type: 'Point',
          coordinates: [long, lat]
        } : null
      });
      await loc.save();
      divisionMap.set(div.id, loc._id);
      console.log(`  Added division: ${div.name}`);
    }

    // 2. Insert districts (have lat/long)
    console.log(`Seeding ${districts.length} districts...`);
    const districtMap = new Map();
    for (const dist of districts) {
      const parentId = divisionMap.get(dist.division_id?.toString());
      if (!parentId) {
        console.warn(`  Skipping district ${dist.name} – parent division missing`);
        continue;
      }
      const lat = safeNumber(dist.lat);
      const long = safeNumber(dist.long);
      const loc = new Location({
        name: dist.name,
        bn_name: dist.bn_name,
        type: 'district',
        parent: parentId,
        lat: lat,
        long: long,
        riskScore: Math.floor(Math.random() * 100),
        floodProne: ['Sunamganj', 'Kurigram', 'Jamalpur', 'Sylhet'].includes(dist.name),
        seismicZone: dist.name === 'Sylhet' ? 'high' : 'moderate',
        geometry: (lat && long) ? {
          type: 'Point',
          coordinates: [long, lat]
        } : null
      });
      await loc.save();
      districtMap.set(dist.id, loc._id);
      console.log(`  Added district: ${dist.name}`);
    }

    // 3. Insert upazilas (may not have lat/long)
    if (upazilas && upazilas.length > 0) {
      console.log(`Seeding ${upazilas.length} upazilas...`);
      let skipped = 0;
      let withoutCoords = 0;
      for (const upa of upazilas) {
        const parentId = districtMap.get(upa.district_id?.toString());
        if (!parentId) {
          skipped++;
          continue;
        }
        const lat = safeNumber(upa.lat);
        const long = safeNumber(upa.long);
        if (!lat || !long) withoutCoords++;
        
        const loc = new Location({
          name: upa.name,
          bn_name: upa.bn_name,
          type: 'upazila',
          parent: parentId,
          lat: lat,
          long: long,
          riskScore: Math.floor(Math.random() * 100),
          floodProne: Math.random() > 0.7,
          seismicZone: upa.name.includes('Sylhet') ? 'high' : 'low',
          geometry: (lat && long) ? {
            type: 'Point',
            coordinates: [long, lat]
          } : null
        });
        await loc.save();
      }
      console.log(`  Added upazilas. Skipped: ${skipped} (no parent), Without coords: ${withoutCoords}`);
    } else {
      console.log('No upazilas data found – skipping');
    }

    console.log('✅ Seeding completed successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();