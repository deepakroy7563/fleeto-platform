import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Please add a customer name'],
    },
    customerPhone: {
      type: String,
      required: [true, 'Please add a customer phone number'],
    },
    bike: {
      type: mongoose.Schema.ObjectId,
      ref: 'Bike',
      required: true,
    },
    dealer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    whatsappMessage: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Booking', bookingSchema);
