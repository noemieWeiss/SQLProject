import * as postsService from '../services/postsService.js';
import { applyQueryOptions } from '../utils/queryBuilder.js';

export const getPosts = async (req, res, next) => {
  try {
    let posts = await postsService.getAllPosts();
    posts = applyQueryOptions(posts, req.query);
    res.json(posts);
  } catch (err) { next(err); }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const posts = await postsService.getUserPosts(req.params.userId);
    res.json(posts);
  } catch (err) { next(err); }
};

export const createPost = async (req, res, next) => {
  try {
    const post = await postsService.addPost(req.body);
    res.status(201).json(post);
  } catch (err) { next(err); }
};

export const updatePost = async (req, res, next) => {
  try {
    const post = await postsService.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (req.body.userId && Number(post.userId) !== Number(req.body.userId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const updated = await postsService.editPost(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await postsService.getPostById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const requestingUserId = req.body.userId ?? req.query.userId;
    if (requestingUserId && Number(post.userId) !== Number(requestingUserId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await postsService.removePost(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
};
