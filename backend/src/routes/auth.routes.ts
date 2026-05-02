import express from 'express';
import { registerUser, authUser, getUserProfile, verifyCode } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/verify', verifyCode);
router.get('/profile', protect, getUserProfile);

export default router;
