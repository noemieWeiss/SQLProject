import pool from '../config/db.js';

export const getPhotosByAlbumId = async (albumId) => {
  const [rows] = await pool.query('SELECT * FROM photos WHERE albumId = ? ORDER BY id', [albumId]);
  return rows;
};

export const createPhoto = async ({ albumId, title, url }) => {
  const [result] = await pool.query('INSERT INTO photos (albumId, title, url) VALUES (?, ?, ?)', [albumId, title, url]);
  return { id: result.insertId, albumId, title, url };
};

export const updatePhoto = async (id, fields) => {
  const keys = Object.keys(fields).map(k => `${k} = ?`).join(', ');
  await pool.query(`UPDATE photos SET ${keys} WHERE id = ?`, [...Object.values(fields), id]);
  const [rows] = await pool.query('SELECT * FROM photos WHERE id = ?', [id]);
  return rows[0];
};

export const deletePhoto = async (id) => {
  await pool.query('DELETE FROM photos WHERE id = ?', [id]);
};

export const getPhotoById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM photos WHERE id = ?', [id]);
  return rows[0];
};
