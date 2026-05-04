import * as postsService from '../services/postsService.js';

export const getPosts = async (req, res) => {
  const posts = await postsService.getAllPosts();
  res.json(posts);
};

export const getUserPosts = async (req, res) => {
  const posts = await postsService.getUserPosts(req.params.userId);
  res.json(posts);
};

export const createPost = async (req, res) => {
  const post = await postsService.addPost(req.body);
  res.status(201).json(post);
};

export const updatePost = async (req, res) => {
  const post = await postsService.editPost(req.params.id, req.body);
  res.json(post);
};

export const deletePost = async (req, res) => {
  await postsService.removePost(req.params.id);
  res.status(204).send();
};
