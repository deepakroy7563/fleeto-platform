const mongoose = require('mongoose');

const partSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a part name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },
    compatibleBikes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Bike',
      },
    ],
    dealer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Part', partSchema);
