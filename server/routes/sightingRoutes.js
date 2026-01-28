const router = require('express').Router();
const Sighting = require('../models/Sighting');
const User = require('../models/User');

// --- CREATE A NEW REPORT ---
router.post('/create', async (req, res) => {
  try {
    const { reporterId, latitude, longitude, elephantCount, behavior, notes } = req.body;

    const newSighting = new Sighting({
      reporterId,
      location: {
        latitude,
        longitude
      },
      elephantCount,
      behavior,
      notes
    });

    const savedSighting = await newSighting.save();

    // Optional: Add +10 points to the user for reporting!
    await User.findByIdAndUpdate(reporterId, { $inc: { points: 10, reportsCount: 1 } });

    res.status(201).json({ message: 'Sighting reported successfully!', sighting: savedSighting });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- GET ALL RECENT SIGHTINGS (For the Map) ---
router.get('/all', async (req, res) => {
  try {
    // Fetch sightings, populate reporter details (only name and role)
    const sightings = await Sighting.find().sort({ timestamp: -1 }).populate('reporterId', 'fullName role');
    res.json(sightings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;