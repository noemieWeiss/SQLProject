import { Router } from 'express';
import { getUsers, getUser, createUser } from '../controllers/usersController.js';
import { getTodos } from '../controllers/todosController.js';
import { getUserPosts } from '../controllers/postsController.js';

const router = Router();
router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUser);
router.get('/:userId/todos', getTodos);
router.get('/:userId/posts', getUserPosts);

export default router;
