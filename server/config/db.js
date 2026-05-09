import mysql from 'mysql2/promise';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from './env.js';

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

export const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS blocked_users (
      blockerId INT NOT NULL,
      blockedId INT NOT NULL,
      PRIMARY KEY (blockerId, blockedId),
      FOREIGN KEY (blockerId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (blockedId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hidden_posts (
      userId INT NOT NULL,
      postId INT NOT NULL,
      PRIMARY KEY (userId, postId),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
    )
  `);
};

export default pool;
