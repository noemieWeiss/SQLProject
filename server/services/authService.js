import { findUserByUsername } from '../models/userModel.js';
import { getPasswordByUserId } from '../models/passwordModel.js';

export const loginUser = async (username, password) => {
  const user = await findUserByUsername(username);
  if (!user) return null;
  const stored = await getPasswordByUserId(user.id);
  if (stored !== password) return null;
  const { id, name, email } = user;
  return { id, username, name, email };
};
