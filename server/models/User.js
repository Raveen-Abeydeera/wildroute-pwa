const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  phone: {
    type: String,
    required: true, // Now it is mandatory!
    unique: true    // Ensures no two accounts share a number
  },
  password: {
    type: String,
    required: true
  },

  // --- Profile Details (From User Profile Screen) ---

  role: {
    type: String,
    enum: ['user', 'ranger', 'admin'],
    default: 'user',
  },

  departmentId: {
    type: String, // For Rangers/Admins
    required: false
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

  // --- Profile Editable Fields ---
  address: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Modern Mongoose hook (No 'next' callback needed for async functions!)
userSchema.pre('save', async function () {
  // If the password wasn't changed, stop immediately.
  if (!this.isModified('password')) return;

  // If it WAS changed, hash the new password.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


module.exports = mongoose.model('User', userSchema);
