import { getAllUsers, getUserById, createUserWithPassword } from '../models/userModel.js';

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
    const user = await createUserWithPassword(req.body);
    res.status(201).json(user);
  } catch (err) { next(err); }
};
