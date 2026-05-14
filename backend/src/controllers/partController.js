import SparePart from '../models/SparePart.js';

// @desc    Get all spare parts
export const getParts = async (req, res) => {
  try {
    let query;
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
    removeFields.forEach((param) => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    let findQuery = JSON.parse(queryStr);
    if (req.query.search) {
      findQuery.$text = { $search: req.query.search };
    }

    query = SparePart.find(findQuery).populate('dealer', 'name agencyName');

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
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await SparePart.countDocuments(findQuery);

    query = query.skip(startIndex).limit(limit);
    const parts = await query;

    const pagination = {};
    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: parts.length,
      total,
      pagination,
      data: parts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single spare part
export const getPart = async (req, res) => {
  try {
    const part = await SparePart.findById(req.params.id).populate('dealer', 'name agencyName phone');
    if (!part) return res.status(404).json({ success: false, message: 'Part not found' });
    res.status(200).json({ success: true, data: part });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new spare part
export const createPart = async (req, res) => {
  try {
    req.body.dealer = req.user.id;
    const part = await SparePart.create(req.body);
    res.status(201).json({ success: true, data: part });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update spare part
export const updatePart = async (req, res) => {
  try {
    let part = await SparePart.findById(req.params.id);
    if (!part) return res.status(404).json({ success: false, message: 'Part not found' });

    if (part.dealer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    part = await SparePart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: part });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete spare part
export const deletePart = async (req, res) => {
  try {
    const part = await SparePart.findById(req.params.id);
    if (!part) return res.status(404).json({ success: false, message: 'Part not found' });

    if (part.dealer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await part.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
