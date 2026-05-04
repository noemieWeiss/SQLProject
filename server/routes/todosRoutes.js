import { Router } from 'express';
import { createTodo, updateTodo, deleteTodo } from '../controllers/todosController.js';

const router = Router();
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;
