const mongoose = require('mongoose');

const sightingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String, // Path to the uploaded evidence image
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending', // Requires Ranger verification to show on map
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a geospatial index for efficient nearby querying
sightingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Sighting', sightingSchema);