import { Router } from 'express';
import { getUsers, getUser, createUser } from '../controllers/usersController.js';
import { getTodos } from '../controllers/todosController.js';
import { getUserPosts } from '../controllers/postsController.js';
import { getUserAlbums } from '../controllers/albumsController.js';

const router = Router();
router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUser);
router.get('/:userId/todos', getTodos);
router.get('/:userId/posts', getUserPosts);
router.get('/:userId/albums', getUserAlbums);

export default router;
