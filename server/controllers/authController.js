import { loginUser } from '../services/authService.js';

export const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await loginUser(username, password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  res.json(user);
};
