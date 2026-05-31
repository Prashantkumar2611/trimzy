const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find PRASANT's user
    const users = await User.find({ role: 'barber' });
    console.log('Barbers found:', users.length);
    for (let u of users) {
      console.log(`User: ${u.email} - onboardingCompleted: ${u.onboardingCompleted}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}
checkUser();
