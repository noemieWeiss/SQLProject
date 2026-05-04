import pool from '../config/db.js';

export const getAllPosts = async () => {
  const [rows] = await pool.query('SELECT * FROM posts ORDER BY id');
  return rows;
};

export const getPostsByUserId = async (userId) => {
  const [rows] = await pool.query('SELECT * FROM posts WHERE userId = ? ORDER BY id', [userId]);
  return rows;
};

export const createPost = async ({ title, body, userId }) => {
  const [result] = await pool.query(
    'INSERT INTO posts (title, body, userId) VALUES (?, ?, ?)',
    [title, body, userId]
  );
  return { id: result.insertId, title, body, userId };
};

export const updatePost = async (id, fields) => {
  const keys = Object.keys(fields).map((k) => `${k} = ?`).join(', ');
  await pool.query(`UPDATE posts SET ${keys} WHERE id = ?`, [...Object.values(fields), id]);
  const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
  return rows[0];
};

export const deletePost = async (id) => {
  await pool.query('DELETE FROM posts WHERE id = ?', [id]);
};

export const getPostById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
  return rows[0];
};
