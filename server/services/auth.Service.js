import { findUserByUsername } from '../models/user.Model.js';
import { getPasswordByUserId } from '../models/password.Model.js';

export const loginUser = async (username, password) => {
  const user = await findUserByUsername(username);
  if (!user) return null;
  const stored = await getPasswordByUserId(user.id);
  if (stored !== password) return null;
  const { id, name, email } = user;
  return { id, username, name, email };
};
