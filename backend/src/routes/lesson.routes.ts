import express from 'express';
import { createLesson, createAssignment } from '../controllers/lesson.controller';
import { protect, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/:courseId', protect, authorizeRoles('TEACHER', 'ADMIN', 'SUPER_ADMIN'), createLesson);
router.post('/:lessonId/assignments', protect, authorizeRoles('TEACHER', 'ADMIN', 'SUPER_ADMIN'), createAssignment);

export default router;
