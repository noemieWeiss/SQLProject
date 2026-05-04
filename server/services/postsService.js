import * as postModel from '../models/postModel.js';
import * as commentModel from '../models/commentModel.js';

export const getAllPosts = () => postModel.getAllPosts();
export const getUserPosts = (userId) => postModel.getPostsByUserId(userId);
export const addPost = (data) => postModel.createPost(data);
export const editPost = (id, data) => postModel.updatePost(id, data);
export const removePost = (id) => postModel.deletePost(id);
export const getPostById = (id) => postModel.getPostById(id);

export const getPostComments = (postId) => commentModel.getCommentsByPostId(postId);
export const addComment = (data) => commentModel.createComment(data);
export const editComment = (id, data) => commentModel.updateComment(id, data);
export const removeComment = (id) => commentModel.deleteComment(id);
export const getCommentById = (id) => commentModel.getCommentById(id);
