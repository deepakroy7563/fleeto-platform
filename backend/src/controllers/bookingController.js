import Booking from '../models/Booking.js';
import Bike from '../models/Bike.js';
import User from '../models/User.js';
import { io } from '../index.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res) => {
  try {
    const { bikeId, customerName, customerPhone, message } = req.body;

    const bike = await Bike.findById(bikeId).populate('dealer');
    if (!bike) {
      return res.status(404).json({ success: false, message: 'Bike not found' });
    }

    const dealer = bike.dealer;

    const whatsappMessage = `Hello ${dealer.agencyName || dealer.name}, I am interested in booking the ${bike.name}. \nName: ${customerName} \nPhone: ${customerPhone} \nMessage: ${message || 'I would like to know more.'}`;

    const booking = await Booking.create({
      customerName,
      customerPhone,
      bike: bikeId,
      dealer: dealer._id,
      whatsappMessage,
      status: 'pending'
    });

    // Emit real-time notification to the dealer
    io.to(dealer._id.toString()).emit('new_booking', {
      message: `New booking inquiry for ${bike.name} from ${customerName}`,
      bookingId: booking._id
    });

    // Also notify admins
    io.to('admin_room').emit('admin_notification', {
      type: 'BOOKING_CREATED',
      message: `Dealer ${dealer.agencyName} received a new booking for ${bike.name}`
    });

    const dealerPhone = dealer.phone.replace(/\D/g, '');
    const whatsappLink = `https://wa.me/${dealerPhone}?text=${encodeURIComponent(whatsappMessage)}`;

    res.status(201).json({
      success: true,
      data: booking,
      whatsappLink
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings
export const getBookings = async (req, res) => {
  try {
    let query;
    if (req.user.role === 'admin') {
      query = Booking.find().populate('bike').populate('dealer', 'name agencyName phone');
    } else {
      query = Booking.find({ dealer: req.user.id }).populate('bike');
    }
    const bookings = await query.sort('-createdAt');
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.dealer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
