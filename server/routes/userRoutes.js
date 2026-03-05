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

        // 1. Count ALL reports by this user
        const reportCount = await Sighting.countDocuments({ user: req.params.id });

        // 2. NEW: Count ONLY VERIFIED reports by this user
        const verifiedCount = await Sighting.countDocuments({ user: req.params.id, status: 'verified' });

        // 3. Get recent reports
        const myReports = await Sighting.find({ user: req.params.id }).sort({ createdAt: -1 }).limit(5);

        res.json({
            user,
            stats: {
                reportCount,
                verifiedCount: verifiedCount, // <-- Now uses the real database count!
                zonesCount: 1
            },
            recentReports: myReports
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- UPDATE USER PROFILE (WITH IMAGE & PASSWORD) ---
router.put('/:id', upload.single('profileImage'), async (req, res) => {
    try {
        const { email, phone, address, currentPassword, newPassword } = req.body;

        // 1. Find the user first (do NOT use findByIdAndUpdate yet)
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // 2. Handle Password Change if requested
        if (currentPassword && newPassword) {
            const isMatch = await user.matchPassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            // Set the new password. The pre('save') hook in User.js will automatically hash it!
            user.password = newPassword;
        }

        // 3. Update standard fields
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.address = address || user.address;

        // 4. Update image if a new one was uploaded
        if (req.file) {
            user.profileImage = req.file.secure_url || req.file.url || req.file.path;
            console.log("Uploaded Image URL:", user.profileImage);
        }

        // 5. Save the user (This triggers the password hashing safely!)
        await user.save();

        // 6. Fetch the updated user without sending the password hash back to the frontend
        const updatedUser = await User.findById(user._id).select('-password');

        res.json(updatedUser);
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
