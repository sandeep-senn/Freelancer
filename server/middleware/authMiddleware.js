import { User } from '../models/Schema.js';
import { verifyAuthToken } from '../utils/auth.js';

const getBearerToken = (headerValue) => {
  if (!headerValue?.startsWith('Bearer ')) {
    return null;
  }

  return headerValue.slice('Bearer '.length).trim();
};

export const requireAuth = async (req, res, next) => {
  try {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    req.user = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      usertype: user.usertype
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.usertype)) {
    return res.status(403).json({ message: 'You are not allowed to perform this action' });
  }

  return next();
};
