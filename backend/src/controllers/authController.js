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
    
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields (name, email, password, phone)' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });

    const location = address ? {
      type: 'Point',
      coordinates: [lng || 0, lat || 0],
      address
    } : undefined;

    // Generate secure verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    
    // Hash token
    const hashedToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    const user = await User.create({ 
      name, 
      email, 
      password, 
      role, 
      phone, 
      agencyName: role === 'dealer' ? agencyName : undefined, 
      location,
      isApproved: role === 'customer' || role === 'admin' ? true : false,
      isVerified: false,
      verificationToken: hashedToken,
      verificationTokenExpiry
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('EMAIL VERIFICATION URL:', verificationUrl);
    }

    const emailMessage = `Welcome to Fleeto! Please verify your email by clicking the link below:\n\n${verificationUrl}\n\nThis link will expire in 24 hours.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify Your Fleeto Account',
        message: emailMessage,
      });

      res.status(201).json({ 
        success: true, 
        message: 'Registration successful! A verification email has been sent. Please verify your email to log in.',
        email: user.email 
      });
    } catch (err) {
      console.error('Nodemailer verification email error:', err);
      res.status(201).json({ 
        success: true, 
        message: 'Registration successful, but there was an error sending the verification email. You can try resending the link.',
        email: user.email 
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login Attempt: ${email}`);

    if (!email || !password) return res.status(400).json({ success: false, message: 'Please provide an email and password' });

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log(`Login Failed: User not found (${email})`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.log(`Login Failed: Incorrect password for ${email}`);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      console.log(`Login Failed: User ${email} is NOT verified`);
      return res.status(401).json({ 
        success: false, 
        message: 'Please verify your email address to log in' 
      });
    }

    // Check if user is approved
    if (!user.isApproved) {
      console.log(`Login Failed: User ${email} is NOT approved`);
      return res.status(403).json({ 
        success: false, 
        message: 'Your account is pending approval or has been disabled. Please contact admin.' 
      });
    }

    console.log(`Login Success: ${email} (Role: ${user.role})`);
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

    if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'your_api_key') {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    if (req.file && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'your_api_key') {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
export const updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = { name: req.body.name, phone: req.body.phone };
    
    // Only dealers should have agencyName and location
    const currentUser = await User.findById(req.user.id);
    if (currentUser && currentUser.role === 'dealer') {
      fieldsToUpdate.agencyName = req.body.agencyName;
      
      if (req.body.location && req.body.location.address) {
        const lng = parseFloat(req.body.location.lng);
        const lat = parseFloat(req.body.location.lat);
        
        if (!isNaN(lng) && !isNaN(lat)) {
          fieldsToUpdate.location = {
            type: 'Point',
            coordinates: [lng, lat],
            address: req.body.location.address
          };
        } else {
          fieldsToUpdate.$unset = { location: 1 };
        }
      } else {
        fieldsToUpdate.$unset = { location: 1 };
      }
    } else {
      // For customers and admins, ensure location and agencyName are removed
      fieldsToUpdate.$unset = { location: 1, agencyName: 1 };
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

// @desc    Verify email address
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired email verification link' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'This account has already been verified. Please log in.' });
    }

    // Generate new secure verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    
    // Hash token
    const hashedToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');

    user.verificationToken = hashedToken;
    user.verificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    if (process.env.NODE_ENV === 'development') {
      console.log('RESENT EMAIL VERIFICATION URL:', verificationUrl);
    }

    const emailMessage = `Please verify your email address by clicking the link below:\n\n${verificationUrl}\n\nThis link will expire in 24 hours.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify Your Fleeto Account (Resent Link)',
        message: emailMessage,
      });

      res.status(200).json({ success: true, message: 'Verification link has been sent to your email.' });
    } catch (err) {
      console.error('Nodemailer resend verification error:', err);
      res.status(500).json({ success: false, message: 'Email could not be sent. Please try again later.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
