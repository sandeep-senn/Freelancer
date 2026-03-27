import { User } from '../models/Schema.js';
import { sanitizeUser } from '../utils/auth.js';

export const fetchUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users.map(sanitizeUser));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch users' });
  }
};
