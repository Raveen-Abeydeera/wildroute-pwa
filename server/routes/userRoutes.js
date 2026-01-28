const router = require('express').Router();
const User = require('../models/User');
const Sighting = require('../models/Sighting');

// --- GET USER PROFILE & STATS ---
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Don't send password
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Count their reports
        const reportCount = await Sighting.countDocuments({ reporterId: req.params.id });

        // Get their recent reports
        const myReports = await Sighting.find({ reporterId: req.params.id })
            .sort({ timestamp: -1 })
            .limit(5);

        res.json({
            user,
            stats: {
                reportCount,
                verifiedCount: 0, // Placeholder for future logic
                zonesCount: 1 // Placeholder
            },
            recentReports: myReports
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
