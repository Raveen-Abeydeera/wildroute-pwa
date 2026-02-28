const router = require('express').Router();
const User = require('../models/User');
const Sighting = require('../models/Sighting');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const CloudinaryStorage = require('multer-storage-cloudinary');

// 1. Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configure Storage Engine for Profile Pictures using v2.2.1 syntax
const storage = CloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'wildroute_profiles',
    allowedFormats: ['jpg', 'png', 'jpeg'],
});
const upload = multer({ storage: storage });

// --- GET USER PROFILE & STATS ---
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const reportCount = await Sighting.countDocuments({ user: req.params.id });
        const myReports = await Sighting.find({ user: req.params.id }).sort({ createdAt: -1 }).limit(5);

        res.json({
            user,
            stats: { reportCount, verifiedCount: 0, zonesCount: 1 },
            recentReports: myReports
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- UPDATE USER PROFILE (WITH IMAGE) ---
router.put('/:id', upload.single('profileImage'), async (req, res) => {
    try {
        const { email, phone, address } = req.body;

        let updateData = { email, phone, address };

        // If an image was uploaded, add the Cloudinary URL to the update
        if (req.file) {
            updateData.profileImage = req.file.path;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).select('-password'); // Return the updated user without the password

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.json(updatedUser);
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
