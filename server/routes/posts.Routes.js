import { Router } from 'express';
import { getPosts, createPost, updatePost, deletePost } from '../controllers/postsController.js';
import { getComments } from '../controllers/commentsController.js';

const router = Router();
router.get('/', getPosts);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.get('/:postId/comments', getComments);

export default router;
