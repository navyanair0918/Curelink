const User = require('../models/User');

// GET /api/users/doctors - Get all doctors for appointment booking
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('-password')
      .sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors
    });
  } catch (error) {
    console.error('Get all doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors',
      error: error.message
    });
  }
};

// PUT /api/users/profile - Update user profile (for doctors to add degree/specialization)
const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId || req.user?._id;
    const { degree, specialization } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in token'
      });
    }

    // Only doctors can update degree and specialization
    if (req.user?.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can update qualifications'
      });
    }

    const updateData = {};
    if (degree) updateData.degree = degree.trim();
    if (specialization) updateData.specialization = specialization.trim();

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

module.exports = {
  getAllDoctors,
  updateProfile
};
