const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const RiskZone = require('../models/RiskZone');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

async function testRiskZone() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Sample Polygon (Triangle) - GeoJSON expects closed loop (first and last point same)
        const sampleZone = {
            name: 'Test Hazard Zone',
            location: {
                type: 'Polygon',
                coordinates: [[
                    [80.1, 6.5],
                    [80.2, 6.5],
                    [80.15, 6.6],
                    [80.1, 6.5] // Closing loop
                ]]
            },
            riskLevel: 'High',
            description: 'Testing geospatial index',
            // Generate a random ObjectId for createdBy since we don't have a real user session here
            createdBy: new mongoose.Types.ObjectId()
        };

        const newZone = new RiskZone(sampleZone);
        const savedZone = await newZone.save();

        console.log('✅ RiskZone Saved Successfully:', savedZone._id);

        // Check indexes
        const indexes = await RiskZone.collection.getIndexes();
        console.log('✅ Indexes:', indexes);

        // Cleanup test data
        await RiskZone.findByIdAndDelete(savedZone._id);
        console.log('✅ Test Data Cleaned Up');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

testRiskZone();
