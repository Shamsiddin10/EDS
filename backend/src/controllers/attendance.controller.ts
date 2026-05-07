import { Request, Response } from 'express';
import prisma from '../config/db';

export const markAttendance = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: today,
        },
      },
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Siz bugun davomatdan o\'tgansiz' });
    }

    const attendance = await prisma.attendance.create({
      data: {
        userId,
        status: true,
      },
    });

    res.status(201).json(attendance);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const checkAttendance = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findFirst({
      where: {
        userId,
        date: {
          gte: today,
        },
      },
    });

    res.json({ hasCheckedIn: !!attendance });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
