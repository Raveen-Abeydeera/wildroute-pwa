const mongoose = require('mongoose');

const riskZoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // e.g., "Habarana Corridor"
    },
    location: {
        type: {
            type: String,
            enum: ['Polygon'], // Using Polygon for areas
            required: true
        },
        coordinates: {
            type: [[[Number]]], // Array of arrays of coordinates [long, lat]
            required: true
        }
    },
    riskLevel: {
        type: String,
        enum: ['High', 'Moderate', 'Low', 'Seasonal'],
        default: 'High'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    description: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Ranger who created it
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a geospatial index for efficient querying
riskZoneSchema.index({ location: '2dsphere' });

const RiskZone = mongoose.model('RiskZone', riskZoneSchema);
module.exports = RiskZone;
