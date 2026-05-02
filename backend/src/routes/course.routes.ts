import express from 'express';
import {
  createCourse,
  getCourses,
  getTeacherCourses,
  getPendingCourses,
  approveCourse,
  enrollInCourse,
  getEnrolledCourses
} from '../controllers/course.controller';
import { protect, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

router.route('/')
  .get(protect, getCourses)
  .post(protect, authorizeRoles('TEACHER', 'ADMIN', 'SUPER_ADMIN'), createCourse);

router.get('/teacher', protect, authorizeRoles('TEACHER'), getTeacherCourses);

router.get('/enrolled', protect, authorizeRoles('STUDENT'), getEnrolledCourses);

router.get('/pending', protect, authorizeRoles('DIRECTOR', 'ADMIN', 'SUPER_ADMIN'), getPendingCourses);

router.put('/:id/approve', protect, authorizeRoles('DIRECTOR', 'ADMIN', 'SUPER_ADMIN'), approveCourse);

router.post('/:id/enroll', protect, authorizeRoles('STUDENT'), enrollInCourse);

export default router;
