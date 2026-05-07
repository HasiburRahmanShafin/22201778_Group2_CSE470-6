const mongoose = require('mongoose');
const User = require('../src/models/User');
const Location = require('../src/models/Location');
require('dotenv').config();

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({ preferredLocations: { $exists: true, $ne: [] } });
    console.log(`Found ${users.length} users with old preferredLocations`);

    for (const user of users) {
      const newPrefs = [];
      for (const oldPref of user.preferredLocations) {
        // Assume oldPref had fields: division, district, upazila, union
        // Find the upazila Location by name (case‑insensitive)
        const upazila = await Location.findOne({
          name: { $regex: new RegExp(`^${oldPref.upazila}$`, 'i') },
          type: 'upazila'
        });
        if (upazila) {
          newPrefs.push(upazila._id);
        } else {
          console.warn(`Upazila not found: ${oldPref.upazila} for user ${user.email}`);
        }
      }
      user.preferredLocations = newPrefs;
      await user.save();
      console.log(`Migrated user ${user.email} – now follows ${newPrefs.length} upazilas`);
    }
    console.log('Migration completed');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

migrate();