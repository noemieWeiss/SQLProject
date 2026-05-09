import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/error.Handler.js';
import { authMiddleware } from './middleware/auth.Middleware.js';
import authRoutes from './routes/auth.Routes.js';
import usersRoutes from './routes/users.Routes.js';
import todosRoutes from './routes/todos.Routes.js';
import postsRoutes from './routes/posts.Routes.js';
import commentsRoutes from './routes/comments.Routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// Public routes
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

// Protected routes
app.use('/todos', authMiddleware, todosRoutes);
app.use('/posts', authMiddleware, postsRoutes);
app.use('/comments', authMiddleware, commentsRoutes);

app.use(errorHandler);

export default app;
