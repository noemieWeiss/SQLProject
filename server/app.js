import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import todosRoutes from './routes/todosRoutes.js';
import postsRoutes from './routes/postsRoutes.js';
import commentsRoutes from './routes/commentsRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/todos', todosRoutes);
app.use('/posts', postsRoutes);
app.use('/comments', commentsRoutes);

app.use(errorHandler);

export default app;
