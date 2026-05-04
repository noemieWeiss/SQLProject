import pool from '../config/db.js';

export const findUserByUsername = async (username) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

export const getAllUsers = async () => {
  const [rows] = await pool.query('SELECT id, username, name, email FROM users');
  return rows;
};

export const getUserById = async (id) => {
  const [rows] = await pool.query('SELECT id, username, name, email FROM users WHERE id = ?', [id]);
  return rows[0];
};
