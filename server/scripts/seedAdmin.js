/**
 * Run this once to create the admin user:
 * node server/scripts/seedAdmin.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ username: process.env.ADMIN_USERNAME });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists. Skipping.');
      process.exit(0);
    }

    const admin = await User.create({
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin',
    });

    console.log(`✅ Admin user created: ${admin.username}`);
    console.log('🔒 You can now log in with your configured credentials.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
