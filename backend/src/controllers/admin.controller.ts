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

// @desc    Get all teachers
// @route   GET /api/admin/teachers
// @access  Private/Director/Admin/SuperAdmin
export const getTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await prisma.user.findMany({
      where: { role: 'TEACHER' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        coursesTaught: {
          select: { id: true, title: true }
        }
      }
    });
    res.json(teachers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Director/Admin/SuperAdmin
export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        enrollments: {
          include: { course: true }
        }
      }
    });
    res.json(students);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance report
// @route   GET /api/admin/attendance
// @access  Private/Director/Admin/SuperAdmin
export const getAttendanceReport = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    const searchDate = date ? new Date(date as string) : new Date();
    searchDate.setHours(0, 0, 0, 0);

    const attendances = await prisma.attendance.findMany({
      where: {
        date: {
          gte: searchDate,
          lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000)
        }
      },
      include: {
        user: {
          select: { firstName: true, lastName: true, role: true }
        }
      }
    });

    res.json(attendances);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
