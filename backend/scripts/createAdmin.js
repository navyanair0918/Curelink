const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('../models/User');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/curelink', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB Connected');
  
  try {
    const existingAdmin = await User.findOne({ email: 'navyanair@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      
      const isPasswordCorrect = await existingAdmin.comparePassword('curelink');
      if (!isPasswordCorrect) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('curelink', salt);
        await User.updateOne(
          { _id: existingAdmin._id },
          { $set: { password: hashedPassword } }
        );
        console.log('Admin password updated!');
        console.log('Please try logging in again.');
      } else {
        console.log('Admin password is correct.');
        console.log('You can login with:');
        console.log('  Email: navyanair@gmail.com');
        console.log('  Password: curelink');
        console.log('  Role: admin');
      }
      
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Admin role updated!');
      }
      
      process.exit(0);
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('curelink', salt);
    
    await User.collection.insertOne({
      name: 'Admin User',
      email: 'navyanair@gmail.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log(' Admin user created successfully!');
    console.log('Email: navyanair@gmail.com');
    console.log('Password: curelink');
    console.log('Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
})
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});
