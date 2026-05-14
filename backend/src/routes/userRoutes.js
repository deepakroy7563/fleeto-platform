import express from 'express';
import { 
  getDealers, 
  getUsers, 
  getAdminDealers, 
  updateUserStatus, 
  deleteUser,
  getAdminStats
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/dealers', getDealers);

// Admin routes
router.get('/', protect, authorize('admin'), getUsers);
router.get('/admin/dealers', protect, authorize('admin'), getAdminDealers);
router.get('/admin/stats', protect, authorize('admin'), getAdminStats);
router.put('/:id/status', protect, authorize('admin'), updateUserStatus);
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;
