// setup.js – Run once to create admin account
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

async function setup() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (existing) {
      console.log('⚠️  Admin already exists:', existing.email);
      process.exit(0);
    }

    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      name: 'Super Admin',
      role: 'super_admin',
    });

    console.log('✅ Admin account created!');
    console.log('   Email   :', process.env.ADMIN_EMAIL);
    console.log('   Password:', process.env.ADMIN_PASSWORD);
    console.log('\n🔐 Login at: http://localhost:3000/admin/login');
    process.exit(0);
  } catch (err) {
    console.error('❌ Setup failed:', err.message);
    process.exit(1);
  }
}

setup();
