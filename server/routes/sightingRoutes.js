const router = require('express').Router();
const Sighting = require('../models/Sighting');
const User = require('../models/User');
const multer = require('multer');

// --- THE FIX IS HERE ---
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configure Storage Engine (v2.2.1 syntax)
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'dmewqz26w',
  allowedFormats: ['jpg', 'png', 'jpeg', 'gif'],
});

const upload = multer({ storage: storage });

// @route   POST /api/sightings
// @desc    Create a new sighting (Image is now uploaded to Cloudinary URL)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { userId, latitude, longitude, description } = req.body;

    // VALIDATION: Ensure coordinates are valid numbers
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ message: 'Invalid coordinates provided.' });
    }

    const newSighting = new Sighting({
      user: userId,
      location: {
        type: 'Point',
        coordinates: [lng, lat] // MongoDB expects [longitude, latitude]
      },
      description,
      // Cloudinary automatically provides the secure URL in req.file.path
      imageUrl: req.file ? req.file.path : null,
      status: 'pending'
    });

    const savedSighting = await newSighting.save();

    // Add +10 points to the user
    await User.findByIdAndUpdate(userId, { $inc: { points: 10, reportsCount: 1 } });

    res.status(201).json(savedSighting);
  } catch (error) {
    console.error("Error saving sighting:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/sightings
// @desc    Get all active sightings (Newer than 4 hours)
router.get('/', async (req, res) => {
  try {
    // 4-Hour Time Filter for the Live Map
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);

    const sightings = await Sighting.find({
      status: { $in: ['verified', 'pending'] },
      createdAt: { $gte: fourHoursAgo }
    }).populate('user', 'name');

    res.json(sightings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/sightings/pending
// @desc    Get ALL pending sightings (No time limit, for Ranger Dashboard)
router.get('/pending', async (req, res) => {
  try {
    const sightings = await Sighting.find({ status: 'pending' })
      .sort({ createdAt: -1 }) // Show newest first
      .populate('user', 'name points'); // Also fetch user points for "Trust Score"
    res.json(sightings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PATCH /api/sightings/:id/verify
// @desc    Verify or Reject a sighting
router.patch('/:id/verify', async (req, res) => {
  try {
    const { status } = req.body;
    const sighting = await Sighting.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!sighting) return res.status(404).json({ message: 'Sighting not found' });
    res.json(sighting);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/sightings/nearby
// @desc    Geospatial Query for Danger Alerts
router.get('/nearby', async (req, res) => {
  try {
    const { lng, lat } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({ message: 'Missing coordinates' });
    }

    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    const radiusInRadians = 2 / 6378.1; // 2km radius

    const nearbySightings = await Sighting.find({
      status: { $in: ['verified', 'pending'] }, // Safety: Warn about pending ones too? Usually just verified.
      createdAt: { $gte: fourHoursAgo },
      location: {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], radiusInRadians]
        }
      }
    });

    res.json(nearbySightings);
  } catch (error) {
    console.error("Proximity Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});
// @route   POST /api/sightings/:id/confirm
// @desc    "I See It Too" - Extends the 4-hour window
router.post('/:id/confirm', async (req, res) => {
  try {
    const { userId } = req.body;
    const sighting = await Sighting.findById(req.params.id);
    if (!sighting) return res.status(404).json({ message: 'Sighting not found' });

    // Prevent double voting
    if (!sighting.confirmations.includes(userId)) {
      sighting.confirmations.push(userId);
      // RESET the creation time to right now, extending it by another 4 hours!
      sighting.createdAt = Date.now();
      await sighting.save();
    }
    res.json(sighting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/sightings/:id/safe
// @desc    "Safe Now" - Resolves the alert if 3 people vote
router.post('/:id/safe', async (req, res) => {
  try {
    const { userId } = req.body;
    const sighting = await Sighting.findById(req.params.id);
    if (!sighting) return res.status(404).json({ message: 'Sighting not found' });

    if (!sighting.safeVotes.includes(userId)) {
      sighting.safeVotes.push(userId);

      // If 3 or more people say it's safe, remove it from the map!
      if (sighting.safeVotes.length >= 3) {
        sighting.status = 'resolved';
      }
      await sighting.save();
    }
    res.json(sighting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/sightings/:id
// @desc    Get a single sighting's details
router.get('/:id', async (req, res) => {
  try {
    const sighting = await Sighting.findById(req.params.id).populate('user', 'fullName role');
    res.json(sighting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;