import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';

export const checkAttendanceMarked = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // If user is not logged in, skip (auth middleware will handle it)
    if (!req.user) {
      return next();
    }

    // Skip check for attendance routes themselves to avoid circular dependency
    if (req.originalUrl.includes('/api/attendance')) {
      return next();
    }

    // Admins and Directors might not need to mark attendance, but if the user wants it for everyone:
    // For now, let's apply it to everyone except Super Admin
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findFirst({
      where: {
        userId: req.user.id,
        date: {
          gte: today,
        },
      },
    });

    if (!attendance) {
      return res.status(403).json({ 
        message: 'Iltimos, avval davomatdan o\'ting (Keldim tugmasini bosing)',
        needsAttendance: true 
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
