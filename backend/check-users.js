const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

async function checkUsers() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);
    const users = await mongoose.connection.db.collection('users').find().toArray();
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUsers();
