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

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
