import express from 'express';
import { getDealers } from '../controllers/userController.js';

const router = express.Router();

router.get('/dealers', getDealers);

export default router;
