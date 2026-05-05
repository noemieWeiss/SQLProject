import * as postsService from '../services/postsService.js';

export const getComments = async (req, res, next) => {
  try {
    const postId = req.params.postId ?? req.query.postId;
    if (!postId) return res.status(400).json({ message: 'postId required' });
    const comments = await postsService.getPostComments(postId);
    res.json(comments);
  } catch (err) { next(err); }
};

export const createComment = async (req, res, next) => {
  try {
    const comment = await postsService.addComment(req.body);
    res.status(201).json(comment);
  } catch (err) { next(err); }
};

export const updateComment = async (req, res, next) => {
  try {
    const comment = await postsService.getCommentById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (req.body.userId && Number(comment.userId) !== Number(req.body.userId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const updated = await postsService.editComment(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await postsService.getCommentById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    const requestingUserId = req.body.userId ?? req.query.userId;
    if (requestingUserId && Number(comment.userId) !== Number(requestingUserId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await postsService.removeComment(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
};
