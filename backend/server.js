const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();


const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.FRONTEND_URL?.replace(/\/$/, ''), 
      'http://localhost:3000',
      'http://localhost:5173'
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

console.log('=== Server Starting ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT || 5000);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('MONGODB_URI set:', !!process.env.MONGODB_URI);

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/curelink';
console.log('Connecting to MongoDB...');
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected Successfully');
})
.catch(err => {
  console.error('MongoDB Connection Error:', err.message);
  console.error('Full error:', err);
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/records', require('./routes/patientRecordRoutes'));
app.use('/api/availability', require('./routes/availabilityRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'CureLink API - Appointment Module' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
