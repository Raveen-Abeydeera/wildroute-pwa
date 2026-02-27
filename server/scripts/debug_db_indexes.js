const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function fixIndexes() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const collection = User.collection;
        const indexes = await collection.getIndexes();
        console.log('Current Indexes:', JSON.stringify(indexes, null, 2));

        try {
            if (indexes.mobileNumber_1) {
                console.log('Found mobileNumber_1 index. Dropping it...');
                await collection.dropIndex('mobileNumber_1');
                console.log('✅ Dropped mobileNumber_1 index');
            } else {
                console.log('mobileNumber_1 index not found in list.');
            }
        } catch (e) {
            console.log('Error dropping index:', e.message);
        }

        console.log('Syncing indexes (this will recreate it as sparse)...');
        await User.syncIndexes();

        // Verify
        const newIndexes = await collection.getIndexes();
        console.log('New Indexes:', JSON.stringify(newIndexes, null, 2));

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

fixIndexes();
