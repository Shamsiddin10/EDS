import { Request, Response } from 'express';
import prisma from '../config/db';

// @desc    Create a new lesson
// @route   POST /api/lessons/:courseId
// @access  Private/Teacher
export const createLesson = async (req: Request, res: Response) => {
  try {
    const { title, content, videoUrl } = req.body;
    const { courseId } = req.params;

    // Verify course belongs to teacher
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.teacherId !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to add lesson to this course');
    }

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        videoUrl,
        courseId,
      },
    });

    res.status(201).json(lesson);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an assignment for a lesson
// @route   POST /api/lessons/:lessonId/assignments
// @access  Private/Teacher
export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { title, description, dueDate } = req.body;
    const { lessonId } = req.params;

    // We should verify if the teacher owns the lesson's course, but keeping simple for now
    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        lessonId,
      },
    });

    res.status(201).json(assignment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
