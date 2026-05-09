import pool from '../config/db.js';

export const blockUser = async (blockerId, blockedId) => {
  await pool.query(
    'INSERT IGNORE INTO blocked_users (blockerId, blockedId) VALUES (?, ?)',
    [blockerId, blockedId]
  );
};

export const isAlreadyBlocked = async (blockerId, blockedId) => {
  const [rows] = await pool.query(
    'SELECT 1 FROM blocked_users WHERE blockerId = ? AND blockedId = ?',
    [blockerId, blockedId]
  );
  return rows.length > 0;
};
