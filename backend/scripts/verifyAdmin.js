const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/curelink', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB Connected');
  
  try {
    const admin = await User.findOne({ email: 'navyanair@gmail.com' });
    
    if (!admin) {
      console.log('Admin user not found!');
      console.log('Run: npm run create-admin');
      process.exit(1);
    }
    
    console.log('Admin user found!');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
    console.log('Role:', admin.role);
    console.log('Created:', admin.createdAt);
    
    const isPasswordCorrect = await admin.comparePassword('curelink');
    if (isPasswordCorrect) {
      console.log('Password is correct!');
    } else {
      console.log('Password is incorrect!');
      console.log('Run: npm run create-admin to update password');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});
