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

export const createUserWithPassword = async ({ username, name, email, password }) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.query(
      'INSERT INTO users (username, name, email) VALUES (?, ?, ?)',
      [username, name, email]
    );
    const userId = result.insertId;
    await conn.query('INSERT INTO passwords (userId, password) VALUES (?, ?)', [userId, password]);
    await conn.commit();
    return { id: userId, username, name, email };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
