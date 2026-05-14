import mongoose from 'mongoose';

const sparePartSchema = new mongoose.Schema(
  {
    partName: {
      type: String,
      required: [true, 'Please add a part name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock count'],
      default: 0,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    compatibleBike: {
      type: String,
      required: [true, 'Please add compatible bike information'],
    },
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

sparePartSchema.index({ partName: 'text', description: 'text' });

export default mongoose.model('SparePart', sparePartSchema);
