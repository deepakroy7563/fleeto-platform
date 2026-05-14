import Bike from '../models/Bike.js';
import { uploadMultiple } from '../utils/cloudinary.js';
import fs from 'fs';
import path from 'path';

// @desc    Get all bikes
export const getBikes = async (req, res) => {
  try {
    let query;
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach((param) => delete reqQuery[param]);
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
    const parsedQuery = JSON.parse(queryStr);
    
    if (req.query.search) {
      parsedQuery.name = { $regex: req.query.search, $options: 'i' };
    }

    query = Bike.find(parsedQuery);

    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bike.countDocuments(parsedQuery);

    query = query.skip(startIndex).limit(limit);
    const results = await query.populate('dealer', 'name agencyName location');

    const pagination = {};
    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: results.length,
      total,
      pagination,
      data: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single bike
export const getBike = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id).populate('dealer', 'name agencyName location');
    if (!bike) return res.status(404).json({ success: false, message: 'Bike not found' });
    res.status(200).json({ success: true, data: bike });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new bike
export const createBike = async (req, res) => {
  try {
    req.body.dealer = req.user.id;
    
    // Handle Images with Cloudinary for Production
    if (req.files && req.files.length > 0) {
      const uploadedImages = await uploadMultiple(req.files);
      req.body.images = uploadedImages;
      
      // Cleanup local files
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }

    if (typeof req.body.specifications === 'string') {
      req.body.specifications = JSON.parse(req.body.specifications);
    }
    if (typeof req.body.features === 'string') {
      req.body.features = req.body.features.split(',').map(f => f.trim());
    }

    const bike = await Bike.create(req.body);
    res.status(201).json({ success: true, data: bike });
  } catch (error) {
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update bike
export const updateBike = async (req, res) => {
  try {
    let bike = await Bike.findById(req.params.id);
    if (!bike) return res.status(404).json({ success: false, message: 'Bike not found' });
    if (bike.dealer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    bike = await Bike.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: bike });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete bike
export const deleteBike = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) return res.status(404).json({ success: false, message: 'Bike not found' });
    if (bike.dealer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    await bike.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
