import express from 'express';
import { getAllUsers, updateUserRole, deleteUser } from '../controllers/admin.controller';
import { protect, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/users', protect, authorizeRoles('ADMIN', 'SUPER_ADMIN'), getAllUsers);
router.put('/users/:id/role', protect, authorizeRoles('ADMIN', 'SUPER_ADMIN'), updateUserRole);
router.delete('/users/:id', protect, authorizeRoles('ADMIN', 'SUPER_ADMIN'), deleteUser);

export default router;
