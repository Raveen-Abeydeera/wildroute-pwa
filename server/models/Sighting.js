const mongoose = require('mongoose');

const sightingSchema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // --- Location Data ---
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    zoneName: { type: String, default: 'Unknown Zone' } // e.g., "Zone A-4"
  },

  // --- Observation Details ---
  elephantCount: {
    type: String, // Storing as string range e.g., "2-5" or "10+"
    required: true
  },
  behavior: {
    type: String, // e.g., "Calm", "Aggressive", "Crossing Road"
    default: 'Unknown'
  },
  notes: {
    type: String,
    trim: true
  },

  // --- Verification ---
  imageUrl: {
    type: String, // We will store the link to the image here
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 43200 // Optional: Auto-delete reports after 12 hours (43200 seconds) to keep map fresh
  }
});

module.exports = mongoose.model('Sighting', sightingSchema);