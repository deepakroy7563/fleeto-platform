import express from 'express';
import { 
  register, 
  login, 
  logout, 
  getProfile, 
  updateProfile,
  updateAvatar,
  forgotPassword,
  resetPassword 
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', protect, logout);
router
  .route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.put('/avatar', protect, upload.single('avatar'), updateAvatar);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

export default router;
