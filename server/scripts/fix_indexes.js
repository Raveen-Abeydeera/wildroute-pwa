const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function fixIndexes() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const collection = User.collection;
        try {
            await collection.dropIndex('mobileNumber_1');
            console.log('Dropped mobileNumber_1 index');
        } catch (e) {
            console.log('Index mobileNumber_1 might not exist or verify error:', e.message);
        }

        console.log('Syncing indexes...');
        await User.syncIndexes();
        console.log('Indexes synced successfully.');

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

fixIndexes();
