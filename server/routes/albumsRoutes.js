import { Router } from 'express';
import { createAlbum, updateAlbum, deleteAlbum, getAlbumPhotos } from '../controllers/albumsController.js';

const router = Router();
router.post('/', createAlbum);
router.put('/:id', updateAlbum);
router.patch('/:id', updateAlbum);
router.delete('/:id', deleteAlbum);
router.get('/:albumId/photos', getAlbumPhotos);

export default router;
