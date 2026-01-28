const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // --- Identity (From Sign Up & Login Screens) ---
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  mobileNumber: {
    type: String,
    required: true, // Required based on your Sign-Up UI
    unique: true
  },
  password: {
    type: String,
    required: true
  },

  // --- Profile Details (From User Profile Screen) ---
  profilePicture: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" // Default avatar
  },
  role: {
    type: String,
    enum: ['User', 'Ranger', 'Conservationist', 'Admin'],
    default: 'User' // Default role
  },
  assignedZone: {
    type: String, // e.g., "Zone A", "Sector B" as seen in Profile
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false // For the "Verified" badge in the UI
  },

  // --- Gamification (From Submission Success Screen) ---
  points: {
    type: Number,
    default: 0 // "+10 Community Points"
  },
  badges: [{
    type: String // e.g., "Wildlife Guardian", "Top Spotter"
  }],
  reportsCount: {
    type: Number,
    default: 0 // To quickly show "24 Reports" on profile
  },

  // --- App Preferences (From Settings Screen) ---
  preferences: {
    pushNotifications: {
      type: Boolean,
      default: true
    },
    proximityAlerts: {
      type: Boolean,
      default: true // "Immediate Hazard Warning" toggle
    },
    mapLayer: {
      type: String,
      enum: ['satellite', 'terrain', 'default'],
      default: 'default'
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);