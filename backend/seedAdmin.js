const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env' });

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}

// Minimal Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['CUSTOMER', 'ADMIN'], default: 'CUSTOMER' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(mongoURI);

  try {
    const existingAdmin = await User.findOne({ email: 'admin@shopez.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      username: 'Admin',
      email: 'admin@shopez.com',
      password: hashedPassword,
      role: 'ADMIN'
    });

    console.log('✅ Admin user created successfully!');
    console.log('-----------------------------------');
    console.log('Email:    admin@shopez.com');
    console.log('Password: admin123');
    console.log('-----------------------------------');
    
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();
