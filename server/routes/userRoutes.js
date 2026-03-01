const router = require('express').Router();
const User = require('../models/User');
const Sighting = require('../models/Sighting');
const multer = require('multer');

// --- EXACT SYNTAX REQUIRED FOR v2.2.1 ---
const cloudinary = require('cloudinary'); // NO v2!
const cloudinaryStorage = require('multer-storage-cloudinary');

// 1. Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configure Storage Engine 
const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'wildroute_profiles',
    allowedFormats: ['jpg', 'png', 'jpeg'], // NO params, NO underscore
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

        // If an image was uploaded, grab the secure Cloudinary URL
        if (req.file) {
            updateData.profileImage = req.file.secure_url || req.file.url || req.file.path;
            console.log("Uploaded Image URL:", updateData.profileImage); // Log to help debug Render logs
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
