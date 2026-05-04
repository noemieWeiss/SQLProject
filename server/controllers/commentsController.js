import * as postsService from '../services/postsService.js';

export const getComments = async (req, res) => {
  const comments = await postsService.getPostComments(req.params.postId);
  res.json(comments);
};

export const createComment = async (req, res) => {
  const comment = await postsService.addComment(req.body);
  res.status(201).json(comment);
};

export const updateComment = async (req, res) => {
  const comment = await postsService.editComment(req.params.id, req.body);
  res.json(comment);
};

export const deleteComment = async (req, res) => {
  const comment = await postsService.getCommentById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  await postsService.removeComment(req.params.id);
  res.status(204).send();
};
