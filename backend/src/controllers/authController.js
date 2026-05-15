import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { uploadSingle } from '../utils/cloudinary.js';
import fs from 'fs';
import crypto from 'crypto';
import cloudinary from '../utils/cloudinary.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Register user
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, agencyName, address, lat, lng } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });

    const location = address ? {
      type: 'Point',
      coordinates: [lng || 0, lat || 0],
      address
    } : undefined;

    const user = await User.create({ 
      name, 
      email, 
      password, 
      role, 
      phone, 
      agencyName: role === 'dealer' ? agencyName : undefined, 
      location,
      isApproved: role === 'customer' || role === 'admin' ? true : false 
    });
    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (!user.isApproved) {
      return res.status(403).json({ 
        success: false, 
        message: 'Your account is pending approval or has been disabled. Please contact admin.' 
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout user
export const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('token', 'none', { 
    expires: new Date(Date.now() + 10 * 1000), 
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  });
  res.status(200).json({ success: true, data: {} });
};

// @desc    Update profile photo
export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a file' });
    const user = await User.findById(req.user.id);
    
    if (user.avatar && user.avatar.public_id) {
      await cloudinary.uploader.destroy(user.avatar.public_id);
    }

    const result = await uploadSingle(req.file, 'fleeto/avatars');
    user.avatar = result;
    await user.save();

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
export const updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = { name: req.body.name, phone: req.body.phone, agencyName: req.body.agencyName };
    if (req.body.location) {
      fieldsToUpdate.location = { type: 'Point', coordinates: [req.body.location.lng, req.body.location.lat], address: req.body.location.address };
    }
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  
  const isProduction = process.env.NODE_ENV === 'production';
  const options = { 
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax'
  };
  
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, agencyName: user.agencyName, location: user.location }
  });
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('RESET PASSWORD URL:', resetUrl);
    }

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please use the link below to reset your password: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message,
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;

      await user.save({ validateBeforeSave: false });

      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
