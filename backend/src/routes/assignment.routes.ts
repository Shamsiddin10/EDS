import express from 'express';
import { getStudentAssignments, submitAssignment } from '../controllers/assignment.controller';
import { protect, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/student', protect, authorizeRoles('STUDENT'), getStudentAssignments);
router.post('/:id/submit', protect, authorizeRoles('STUDENT'), submitAssignment);

export default router;
