import pool from '../config/db.js';

export const getAlbumsByUserId = async (userId) => {
  const [rows] = await pool.query('SELECT * FROM albums WHERE userId = ? ORDER BY id', [userId]);
  return rows;
};

export const createAlbum = async ({ userId, title }) => {
  const [result] = await pool.query('INSERT INTO albums (userId, title) VALUES (?, ?)', [userId, title]);
  return { id: result.insertId, userId, title };
};

export const updateAlbum = async (id, fields) => {
  const keys = Object.keys(fields).map(k => `${k} = ?`).join(', ');
  await pool.query(`UPDATE albums SET ${keys} WHERE id = ?`, [...Object.values(fields), id]);
  const [rows] = await pool.query('SELECT * FROM albums WHERE id = ?', [id]);
  return rows[0];
};

export const deleteAlbum = async (id) => {
  await pool.query('DELETE FROM albums WHERE id = ?', [id]);
};

export const getAlbumById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM albums WHERE id = ?', [id]);
  return rows[0];
};
