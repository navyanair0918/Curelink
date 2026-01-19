const User = require('../models/User');
const Appointment = require('../models/Appointment');

const getAllUsers = async (req, res) => {
  try 
  {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    const patients = users.filter(user => user.role === 'patient');
    const doctors = users.filter(user => user.role === 'doctor');
    const admins = users.filter(user => user.role === 'admin');
    
    res.status(200).json({
      success: true,
      total: users.length,
      patients: {
        count: patients.length,
        data: patients
      },
      doctors: {
        count: doctors.length,
        data: doctors
      },
      admins: {
        count: admins.length,
        data: admins
      },
      allUsers: users
    });
  }
  catch (error) 
  {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

const getAllPatients = async (req, res) => {
  try 
  {
    const patients = await User.find({ role: 'patient' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: patients.length,
      patients
    });
  } 
  catch (error) 
  {
    console.error('Get all patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patients',
      error: error.message
    });
  }
};

const getAllDoctors = async (req, res) => {
  try 
  {
    const doctors = await User.find({ role: 'doctor' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors
    });
  } 
  catch (error) 
  {
    console.error('Get all doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors',
      error: error.message
    });
  }
};

const getAllAppointments = async (req, res) => {
  try 
  {
    const appointments = await Appointment.find()
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email')
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } 
  catch (error) 
  {
    console.error('Get all appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

const getDashboardStats = async (req, res) => {
  try 
  {
    const totalUsers = await User.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });
    const confirmedAppointments = await Appointment.countDocuments({ status: 'Confirmed' });
    const completedAppointments = await Appointment.countDocuments({ status: 'Completed' });
    
    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          patients: totalPatients,
          doctors: totalDoctors,
          admins: totalAdmins
        },
        appointments: {
          total: totalAppointments,
          pending: pendingAppointments,
          confirmed: confirmedAppointments,
          completed: completedAppointments
        }
      }
    });
  } 
  catch (error) 
  {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getAllPatients,
  getAllDoctors,
  getAllAppointments,
  getDashboardStats
};
