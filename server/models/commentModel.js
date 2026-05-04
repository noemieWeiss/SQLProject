import pool from '../config/db.js';

export const getCommentsByPostId = async (postId) => {
  const [rows] = await pool.query('SELECT * FROM comments WHERE postId = ? ORDER BY id', [postId]);
  return rows;
};

export const createComment = async ({ postId, userId, name, body }) => {
  const [result] = await pool.query(
    'INSERT INTO comments (postId, userId, name, body) VALUES (?, ?, ?, ?)',
    [postId, userId, name, body]
  );
  return { id: result.insertId, postId, userId, name, body };
};

export const updateComment = async (id, fields) => {
  const keys = Object.keys(fields).map((k) => `${k} = ?`).join(', ');
  await pool.query(`UPDATE comments SET ${keys} WHERE id = ?`, [...Object.values(fields), id]);
  const [rows] = await pool.query('SELECT * FROM comments WHERE id = ?', [id]);
  return rows[0];
};

export const deleteComment = async (id) => {
  await pool.query('DELETE FROM comments WHERE id = ?', [id]);
};

export const getCommentById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM comments WHERE id = ?', [id]);
  return rows[0];
};
