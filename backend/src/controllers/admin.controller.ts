import { Request, Response } from 'express';
import prisma from '../config/db';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin/SuperAdmin
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin/SuperAdmin
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Prevent changing Super Admin roles unless requester is Super Admin
    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser.role === 'SUPER_ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ message: 'Cannot modify Super Admin privileges' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, firstName: true, lastName: true, phoneNumber: true, role: true }
    });

    res.json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin/SuperAdmin
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (targetUser.role === 'SUPER_ADMIN') {
      return res.status(403).json({ message: 'Cannot delete a Super Admin' });
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
