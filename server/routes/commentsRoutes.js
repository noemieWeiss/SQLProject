import { Router } from 'express';
import { createComment, updateComment, deleteComment } from '../controllers/commentsController.js';

const router = Router();
router.post('/', createComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;
