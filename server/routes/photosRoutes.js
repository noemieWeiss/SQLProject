import { Router } from 'express';
import { createPhoto, updatePhoto, deletePhoto } from '../controllers/albumsController.js';

const router = Router();
router.post('/', createPhoto);
router.put('/:id', updatePhoto);
router.patch('/:id', updatePhoto);
router.delete('/:id', deletePhoto);

export default router;
