import express from 'express';
import { getAllUsers, updateUserRole, deleteUser, getTeachers, getStudents, getAttendanceReport } from '../controllers/admin.controller';
import { protect, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/users', protect, authorizeRoles('ADMIN', 'SUPER_ADMIN', 'DIRECTOR'), getAllUsers);
router.put('/users/:id/role', protect, authorizeRoles('ADMIN', 'SUPER_ADMIN'), updateUserRole); // Only admins can change roles
router.delete('/users/:id', protect, authorizeRoles('ADMIN', 'SUPER_ADMIN'), deleteUser);

router.get('/teachers', protect, authorizeRoles('ADMIN', 'SUPER_ADMIN', 'DIRECTOR'), getTeachers);
router.get('/students', protect, authorizeRoles('ADMIN', 'SUPER_ADMIN', 'DIRECTOR'), getStudents);
router.get('/attendance', protect, authorizeRoles('ADMIN', 'SUPER_ADMIN', 'DIRECTOR'), getAttendanceReport);

export default router;
