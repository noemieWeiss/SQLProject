import { Router } from 'express';
import { getPosts, createPost, updatePost, deletePost, softDeletePost } from '../controllers/posts.Controller.js';
import { getComments } from '../controllers/comments.Controller.js';

const router = Router();
router.get('/', getPosts);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.post('/:id/hide', softDeletePost);
router.get('/:postId/comments', getComments);

export default router;
