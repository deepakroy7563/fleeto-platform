import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

// @desc    Register user
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, agencyName, address, lat, lng } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

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
      location
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
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout user
export const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true, data: {} });
};

// @desc    Update profile photo
export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload a file' });

    const user = await User.findById(req.user.id);
    
    // Delete old avatar if exists locally
    if (user.avatar && user.avatar.public_id) {
      const oldPath = path.join(process.cwd(), 'uploads', user.avatar.public_id);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Set new avatar
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    user.avatar = {
      url: `${baseUrl}/uploads/${req.file.filename}`,
      public_id: req.file.filename
    };
    
    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
export const updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      agencyName: req.body.agencyName,
    };

    if (req.body.location) {
      fieldsToUpdate.location = {
        type: 'Point',
        coordinates: [req.body.location.lng, req.body.location.lat],
        address: req.body.location.address
      };
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

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
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      agencyName: user.agencyName,
      location: user.location,
    }
  });
};
