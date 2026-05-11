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

ב