import express from 'express';
import { getSubmissionsForGrading, gradeSubmission } from '../controllers/grade.controller';
import { protect, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/submissions', protect, authorizeRoles('TEACHER', 'ADMIN', 'SUPER_ADMIN'), getSubmissionsForGrading);
router.post('/:submissionId', protect, authorizeRoles('TEACHER', 'ADMIN', 'SUPER_ADMIN'), gradeSubmission);

export default router;
