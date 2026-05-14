import User from '../models/User.js';

// @desc    Get all approved dealers
// @route   GET /api/users/dealers
// @access  Public
export const getDealers = async (req, res) => {
  try {
    const dealers = await User.find({ role: 'dealer', isApproved: true }).select('-password');
    res.status(200).json({ success: true, count: dealers.length, data: dealers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
