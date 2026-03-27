import bcrypt from 'bcrypt';
import { User, Freelancer } from '../models/Schema.js';
import { createAuthToken, sanitizeUser } from '../utils/auth.js';
import { isValidEmail } from '../utils/request.js';

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, usertype } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!username?.trim() || !normalizedEmail || !password || !usertype) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    if (!['freelancer', 'client', 'admin'].includes(usertype)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password: passwordHash,
      usertype
    });

    if (usertype === 'freelancer') {
      await Freelancer.create({ userId: user._id });
    }

    const safeUser = sanitizeUser(user);
    const token = createAuthToken(safeUser);

    return res.status(201).json({ user: safeUser, token });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to register user' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const safeUser = sanitizeUser(user);
    const token = createAuthToken(safeUser);

    return res.status(200).json({ user: safeUser, token });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to login' });
  }
};

export const getCurrentUser = async (req, res) => {
  return res.status(200).json({ user: req.user });
};
