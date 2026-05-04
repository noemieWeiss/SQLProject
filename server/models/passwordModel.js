import pool from '../config/db.js';

export const getPasswordByUserId = async (userId) => {
  const [rows] = await pool.query('SELECT password FROM passwords WHERE userId = ?', [userId]);
  return rows[0]?.password;
};
