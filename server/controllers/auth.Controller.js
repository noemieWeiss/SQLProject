import { loginUser } from '../services/auth.Service.js';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await loginUser(username, password);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    res.json(user);
  } catch (err) { next(err); }
};
