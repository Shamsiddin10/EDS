import { Request, Response } from 'express';
import prisma from '../config/db';

// @desc    Get all submissions for courses taught by the teacher
// @route   GET /api/grades/submissions
// @access  Private/Teacher
export const getSubmissionsForGrading = async (req: Request, res: Response) => {
  try {
    const teacherId = req.user.id;

    const submissions = await prisma.submission.findMany({
      where: {
        assignment: {
          lesson: {
            course: {
              teacherId
            }
          }
        }
      },
      include: {
        student: { select: { firstName: true, lastName: true, phoneNumber: true } },
        assignment: {
          select: { title: true, dueDate: true, lesson: { select: { course: { select: { title: true } } } } }
        },
        grade: true // Include grade to see if it's already graded
      },
      orderBy: { submittedAt: 'desc' }
    });

    res.json(submissions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grade a submission
// @route   POST /api/grades/:submissionId
// @access  Private/Teacher
export const gradeSubmission = async (req: Request, res: Response) => {
  try {
    const { submissionId } = req.params;
    const { score, feedback } = req.body;
    const teacherId = req.user.id;

    // Optional: verify the teacher actually owns this submission's course
    // In a production app you should verify ownership to prevent teachers grading other teachers' students

    const existingGrade = await prisma.grade.findUnique({
      where: { submissionId }
    });

    if (existingGrade) {
      res.status(400);
      throw new Error('This submission has already been graded');
    }

    const grade = await prisma.grade.create({
      data: {
        submissionId,
        score: parseFloat(score),
        feedback,
        teacherId
      }
    });

    res.status(201).json(grade);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
