import mongoose from 'mongoose';

const bikeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a bike name'],
      trim: true,
    },
    brand: {
      type: String,
      default: 'Fleeto',
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['City', 'Sport', 'Cruiser', 'Off-Road'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    features: [String],
    specifications: {
      range: String,
      topSpeed: String,
      battery: String,
      chargingTime: String,
      weight: String,
      motorPower: String,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    videoUrl: String,
    stock: {
      type: Number,
      default: 0,
    },
    dealer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Bike', bikeSchema);
