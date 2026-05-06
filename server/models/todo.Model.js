import pool from '../config/db.js';

export const getTodosByUserId = async (userId) => {
  const [rows] = await pool.query('SELECT * FROM todos WHERE userId = ? ORDER BY id', [userId]);
  return rows;
};

export const createTodo = async ({ title, userId, completed = false }) => {
  const [result] = await pool.query(
    'INSERT INTO todos (title, userId, completed) VALUES (?, ?, ?)',
    [title, userId, completed]
  );
  return { id: result.insertId, title, userId, completed };
};

export const updateTodo = async (id, fields) => {
  const keys = Object.keys(fields).map((k) => `${k} = ?`).join(', ');
  await pool.query(`UPDATE todos SET ${keys} WHERE id = ?`, [...Object.values(fields), id]);
  const [rows] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
  return rows[0];
};

export const deleteTodo = async (id) => {
  await pool.query('DELETE FROM todos WHERE id = ?', [id]);
};
