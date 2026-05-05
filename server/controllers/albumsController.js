import * as albumModel from '../models/albumModel.js';
import * as photoModel from '../models/photoModel.js';

export const getUserAlbums = async (req, res, next) => {
  try {
    const albums = await albumModel.getAlbumsByUserId(req.params.userId);
    res.json(albums);
  } catch (err) { next(err); }
};

export const createAlbum = async (req, res, next) => {
  try {
    const album = await albumModel.createAlbum(req.body);
    res.status(201).json(album);
  } catch (err) { next(err); }
};

export const updateAlbum = async (req, res, next) => {
  try {
    const album = await albumModel.getAlbumById(req.params.id);
    if (!album) return res.status(404).json({ message: 'Album not found' });
    const updated = await albumModel.updateAlbum(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};

export const deleteAlbum = async (req, res, next) => {
  try {
    const album = await albumModel.getAlbumById(req.params.id);
    if (!album) return res.status(404).json({ message: 'Album not found' });
    await albumModel.deleteAlbum(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
};

export const getAlbumPhotos = async (req, res, next) => {
  try {
    const photos = await photoModel.getPhotosByAlbumId(req.params.albumId);
    res.json(photos);
  } catch (err) { next(err); }
};

export const createPhoto = async (req, res, next) => {
  try {
    const photo = await photoModel.createPhoto(req.body);
    res.status(201).json(photo);
  } catch (err) { next(err); }
};

export const updatePhoto = async (req, res, next) => {
  try {
    const photo = await photoModel.getPhotoById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    const updated = await photoModel.updatePhoto(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};

export const deletePhoto = async (req, res, next) => {
  try {
    const photo = await photoModel.getPhotoById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    await photoModel.deletePhoto(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
};
