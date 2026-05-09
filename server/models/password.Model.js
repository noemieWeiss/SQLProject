import pool from '../config/db.js';

export const getPasswordByUserId = async (userId) => {
  const [rows] = await pool.query('SELECT password FROM passwords WHERE userId = ?', [userId]);
  return rows[0]?.password;
};

export const updatePassword = async (userId, newPassword) => {
  await pool.query('UPDATE passwords SET password = ? WHERE userId = ?', [newPassword, userId]);
};
