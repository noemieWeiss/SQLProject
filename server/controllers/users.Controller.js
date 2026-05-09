import { getAllUsers, getUserById, createUserWithPassword } from '../models/user.Model.js';
import { getPasswordByUserId, updatePassword } from '../models/password.Model.js';
import { blockUser as blockUserModel, isAlreadyBlocked } from '../models/block.Model.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) { next(err); }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
};

export const createUser = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password || password.length <= 8) {
      return res.status(400).json({ message: 'Password must be more than 8 characters' });
    }
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one number' });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: 'Password must contain at least one uppercase letter' });
    }
    const user = await createUserWithPassword(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Username already exists' });
    }
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.params.id;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'currentPassword and newPassword are required' });
    }
    if (newPassword.length <= 8) {
      return res.status(400).json({ message: 'New password must be more than 8 characters' });
    }
    if (!/[0-9]/.test(newPassword)) {
      return res.status(400).json({ message: 'New password must contain at least one number' });
    }
    if (!/[A-Z]/.test(newPassword)) {
      return res.status(400).json({ message: 'New password must contain at least one uppercase letter' });
    }
    const storedPassword = await getPasswordByUserId(userId);
    if (!storedPassword || storedPassword !== currentPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    await updatePassword(userId, newPassword);
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) { next(err); }
};

export const blockUser = async (req, res, next) => {
  try {
    const { blockerId, blockedId, password } = req.body;
    if (!blockerId || !blockedId || !password) {
      return res.status(400).json({ message: 'blockerId, blockedId and password are required' });
    }
    if (Number(blockerId) === Number(blockedId)) {
      return res.status(400).json({ message: 'Cannot block yourself' });
    }

    const storedPassword = await getPasswordByUserId(blockerId);
    if (!storedPassword || storedPassword !== password) {
      return res.status(400).json({ message: 'Wrong password' });
    }

    const alreadyBlocked = await isAlreadyBlocked(blockerId, blockedId);
    if (alreadyBlocked) {
      return res.status(200).json({ message: 'Already blocked' });
    }

    await blockUserModel(blockerId, blockedId);
    res.status(200).json({ message: 'User blocked successfully' });
  } catch (err) { next(err); }
};
