const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Import User model
const User = require('../models/User');

// 10 Indian doctors with specializations
const doctors = [
  {
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@gmail.com',
    password: 'Doctor@123',
    role: 'doctor',
    degree: 'MBBS, MD',
    specialization: 'Cardiologist'
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@gmail.com',
    password: 'Doctor@123',
    role: 'doctor',
    degree: 'MBBS, MD',
    specialization: 'General Physician'
  },
  {
    name: 'Dr. Amit Patel',
    email: 'amit.patel@gmail.com',
    password: 'Doctor@123',
    role: 'doctor',
    degree: 'MBBS, MS',
    specialization: 'Orthopedic Surgeon'
  },
  {
    name: 'Dr. Anjali Reddy',
    email: 'anjali.reddy@gmail.com',
    password: 'Doctor@123',
    role: 'doctor',
    degree: 'MBBS, MD',
    specialization: 'Pediatrician'
  },
  {
    name: 'Dr. Vikram Singh',
    email: 'vikram.singh@gmail.com',
    password: 'Doctor@123',
    role: 'doctor',
    degree: 'MBBS, MD',
    specialization: 'Neurologist'
  },
  {
    name: 'Dr. Meera Nair',
    email: 'meera.nair@gmail.com',
    password: 'Doctor@123',
    role: 'doctor',
    degree: 'MBBS, MD',
    specialization: 'Dermatologist'
  },
  {
    name: 'Dr. Suresh Iyer',
    email: 'suresh.iyer@gmail.com',
    password: 'Doctor@123',
    role: 'doctor',
    degree: 'MBBS, MS',
    specialization: 'ENT Specialist'
  },
  {
    name: 'Dr. Kavita Desai',
    email: 'kavita.desai@gmail.com',
    password: 'Doctor@123',
    role: 'doctor',
    degree: 'MBBS, MD',
    specialization: 'Gynecologist'
  },
  {
    name: 'Dr. Ravi Menon',
    email: 'ravi.menon@gmail.com',
    password: 'Doctor@123',
    role: 'doctor',
    degree: 'MBBS, MD',
    specialization: 'Psychiatrist'
  },
  {
    name: 'Dr. Sunita Joshi',
    email: 'sunita.joshi@gmail.com',
    password: 'Doctor@123',
    role: 'doctor',
    degree: 'MBBS, MD',
    specialization: 'Ophthalmologist'
  }
];

async function seedDoctors() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/curelink', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');

    // Clear existing doctors (optional - comment out if you want to keep existing)
    // await User.deleteMany({ role: 'doctor' });
    // console.log('Cleared existing doctors');

    let created = 0;
    let skipped = 0;

    // Create doctors
    for (const doctorData of doctors) {
      try {
        // Check if doctor already exists
        const existingDoctor = await User.findOne({ email: doctorData.email });
        if (existingDoctor) {
          console.log(`Doctor ${doctorData.name} already exists, skipping...`);
          skipped++;
          continue;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(doctorData.password, salt);

        // Create doctor
        const doctor = new User({
          ...doctorData,
          password: hashedPassword
        });

        await doctor.save();
        console.log(`✅ Created doctor: ${doctorData.name} - ${doctorData.specialization}`);
        created++;
      } catch (error) {
        console.error(`Error creating doctor ${doctorData.name}:`, error.message);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`Created: ${created} doctors`);
    console.log(`Skipped: ${skipped} doctors (already exist)`);
    console.log(`Total: ${doctors.length} doctors`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding doctors:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDoctors();
