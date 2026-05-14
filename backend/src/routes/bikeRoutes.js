import express from 'express';
import {
  getBikes,
  getBike,
  createBike,
  updateBike,
  deleteBike,
} from '../controllers/bikeController.js';
import { protect, authorize } from '../middleware/auth.js';

import upload from '../middleware/upload.js';

const router = express.Router();

router
  .route('/')
  .get(getBikes)
  .post(protect, authorize('dealer', 'admin'), upload.array('images', 10), createBike);

router
  .route('/:id')
  .get(getBike)
  .put(protect, authorize('dealer', 'admin'), updateBike)
  .delete(protect, authorize('dealer', 'admin'), deleteBike);

export default router;
