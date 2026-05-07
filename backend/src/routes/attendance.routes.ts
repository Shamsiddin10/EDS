import express from 'express';
import { markAttendance, checkAttendance } from '../controllers/attendance.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', protect, markAttendance);
router.get('/status', protect, checkAttendance);

export default router;
