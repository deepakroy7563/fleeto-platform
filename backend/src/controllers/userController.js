import User from '../models/User.js';
import Bike from '../models/Bike.js';
import Booking from '../models/Booking.js';

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
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all dealers (for admin)
// @route   GET /api/users/admin/dealers
// @access  Private/Admin
export const getAdminDealers = async (req, res) => {
  try {
    const dealers = await User.find({ role: 'dealer' }).select('-password');
    res.status(200).json({ success: true, count: dealers.length, data: dealers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user status (approval)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await user.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get admin stats
// @route   GET /api/users/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const [userCount, dealerCount, bikeCount, bookingCount] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'dealer' }),
      Bike.countDocuments({}),
      Booking.countDocuments({})
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: userCount,
        dealers: dealerCount,
        bikes: bikeCount,
        bookings: bookingCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
