import express from 'express';
import { createQuiz, getQuizzesByCourse, submitQuiz } from '../controllers/quiz.controller';
import { protect, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', protect, authorizeRoles('TEACHER', 'ADMIN', 'SUPER_ADMIN'), createQuiz);
router.get('/course/:courseId', protect, getQuizzesByCourse);
router.post('/submit', protect, submitQuiz);

export default router;
