import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/course.routes';
import lessonRoutes from './routes/lesson.routes';
import assignmentRoutes from './routes/assignment.routes';
import gradeRoutes from './routes/grade.routes';
import adminRoutes from './routes/admin.routes';
import attendanceRoutes from './routes/attendance.routes';
import quizRoutes from './routes/quiz.routes';
import { checkAttendanceMarked } from './middleware/attendance.middleware';
import { protect } from './middleware/auth.middleware';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

// Protected routes that require attendance
app.use('/api/courses', protect, checkAttendanceMarked, courseRoutes);
app.use('/api/lessons', protect, checkAttendanceMarked, lessonRoutes);
app.use('/api/assignments', protect, checkAttendanceMarked, assignmentRoutes);
app.use('/api/grades', protect, checkAttendanceMarked, gradeRoutes);
app.use('/api/quizzes', protect, checkAttendanceMarked, quizRoutes);
app.use('/api/admin', protect, checkAttendanceMarked, adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
