import express from 'express';
import {
  createBooking,
  getBookings,
  updateBookingStatus
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .post(createBooking)
  .get(protect, authorize('dealer', 'admin'), getBookings);

router
  .route('/:id')
  .put(protect, authorize('dealer', 'admin'), updateBookingStatus);

export default router;
