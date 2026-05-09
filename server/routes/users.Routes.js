import { Router } from 'express';
import { getUsers, getUser, createUser, blockUser, changePassword } from '../controllers/users.Controller.js';
import { getTodos } from '../controllers/todos.Controller.js';
import { getUserPosts } from '../controllers/posts.Controller.js';
import { authMiddleware } from '../middleware/auth.Middleware.js';

const router = Router();

// Public
router.post('/', createUser);

// Protected
router.get('/', authMiddleware, getUsers);
router.post('/block', authMiddleware, blockUser);
router.get('/:id', authMiddleware, getUser);
router.put('/:id/password', authMiddleware, changePassword);
router.get('/:userId/todos', authMiddleware, getTodos);
router.get('/:userId/posts', authMiddleware, getUserPosts);

export default router;
