import { Request, Response } from 'express';
import prisma from '../config/db';

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Teacher
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        teacherId: req.user.id,
      },
    });

    res.status(201).json(course);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all approved courses (for students)
// @route   GET /api/courses
// @access  Private
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      where: { isApproved: true },
      include: {
        teacher: { select: { firstName: true, lastName: true, phoneNumber: true } },
      },
    });

    res.json(courses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get courses taught by the logged-in teacher
// @route   GET /api/courses/teacher
// @access  Private/Teacher
export const getTeacherCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      where: { teacherId: req.user.id },
      include: {
        _count: { select: { enrollments: true, lessons: true } },
      },
    });

    res.json(courses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all pending courses for approval
// @route   GET /api/courses/pending
// @access  Private/Director,Admin
export const getPendingCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      where: { isApproved: false },
      include: {
        teacher: { select: { firstName: true, lastName: true } },
      },
    });

    res.json(courses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a course
// @route   PUT /api/courses/:id/approve
// @access  Private/Director,Admin
export const approveCourse = async (req: Request, res: Response) => {
  try {
    const course = await prisma.course.update({
      where: { id: req.params.id },
      data: { isApproved: true },
    });

    res.json(course);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll a student in a course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
export const enrollInCourse = async (req: Request, res: Response) => {
  try {
    const { id: courseId } = req.params;

    const course = await prisma.course.findUnique({ where: { id: courseId } });

    if (!course || !course.isApproved) {
      res.status(404);
      throw new Error('Course not found or not approved yet');
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: req.user.id,
        courseId,
      },
    });

    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get enrolled courses for student
// @route   GET /api/courses/enrolled
// @access  Private/Student
export const getEnrolledCourses = async (req: Request, res: Response) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: req.user.id },
      include: {
        course: {
          include: {
            teacher: { select: { firstName: true, lastName: true } }
          }
        }
      }
    });

    res.json(enrollments.map(e => e.course));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
