import express from 'express';
import {
  getParts,
  getPart,
  createPart,
  updatePart,
  deletePart,
} from '../controllers/partController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .get(getParts)
  .post(protect, authorize('dealer', 'admin'), createPart);

router
  .route('/:id')
  .get(getPart)
  .put(protect, authorize('dealer', 'admin'), updatePart)
  .delete(protect, authorize('dealer', 'admin'), deletePart);

export default router;
