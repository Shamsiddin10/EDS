import { Request, Response } from 'express';
import prisma from '../config/db';

// @desc    Get assignments for a student's enrolled courses
// @route   GET /api/assignments/student
// @access  Private/Student
export const getStudentAssignments = async (req: Request, res: Response) => {
  try {
    const studentId = req.user.id;

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      select: { courseId: true }
    });

    const courseIds = enrollments.map(e => e.courseId);

    const assignments = await prisma.assignment.findMany({
      where: {
        lesson: {
          courseId: { in: courseIds }
        }
      },
      include: {
        lesson: {
          select: { title: true, course: { select: { title: true } } }
        },
        submissions: {
          where: { studentId }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    res.json(assignments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit an assignment
// @route   POST /api/assignments/:id/submit
// @access  Private/Student
export const submitAssignment = async (req: Request, res: Response) => {
  try {
    const { id: assignmentId } = req.params;
    const { fileUrl } = req.body;
    const studentId = req.user.id;

    // Check if already submitted
    const existing = await prisma.submission.findUnique({
      where: {
        studentId_assignmentId: {
          studentId,
          assignmentId
        }
      }
    });

    if (existing) {
      res.status(400);
      throw new Error('Assignment already submitted');
    }

    const submission = await prisma.submission.create({
      data: {
        studentId,
        assignmentId,
        fileUrl
      }
    });

    res.status(201).json(submission);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
