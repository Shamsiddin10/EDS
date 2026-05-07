import { Request, Response } from 'express';
import prisma from '../config/db';

export const createQuiz = async (req: Request, res: Response) => {
  try {
    const { title, description, courseId, questions } = req.body;
    const teacherId = req.user.id;

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        courseId,
        teacherId,
        questions: {
          create: questions.map((q: any) => ({
            text: q.text,
            options: {
              create: q.options.map((o: any) => ({
                text: o.text,
                isCorrect: o.isCorrect,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    res.status(201).json(quiz);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuizzesByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const quizzes = await prisma.quiz.findMany({
      where: { courseId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
    res.json(quizzes);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const submitQuiz = async (req: Request, res: Response) => {
  try {
    const { quizId, answers } = req.body; // answers: { questionId: optionId }
    const studentId = req.user.id;

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Test topilmadi' });
    }

    let correctCount = 0;
    quiz.questions.forEach((q) => {
      const selectedOptionId = answers[q.id];
      const correctOption = q.options.find((o) => o.isCorrect);
      if (correctOption && correctOption.id === selectedOptionId) {
        correctCount++;
      }
    });

    const score = (correctCount / quiz.questions.length) * 100;

    const result = await prisma.quizResult.create({
      data: {
        score,
        studentId,
        quizId,
      },
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
