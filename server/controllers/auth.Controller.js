import { createRequire } from 'module';
import { JWT_SECRET } from '../config/env.js';
const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken');
import { loginUser } from '../services/auth.Service.js';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await loginUser(username, password);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ ...user, token });
  } catch (err) { next(err); }
};
