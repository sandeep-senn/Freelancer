import { Application, Chat, Freelancer, Project, User } from '../models/Schema.js';
import { sanitizeUser } from '../utils/auth.js';

export const fetchUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users.map(sanitizeUser));
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch users' });
  }
};

const allowedUserTypes = ['freelancer', 'client', 'admin'];

export const updateUserRole = async (req, res) => {
  try {
    const { usertype } = req.body;

    if (!allowedUserTypes.includes(usertype)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    if (req.params.id === req.user._id) {
      return res.status(400).json({ message: 'Admins cannot change their own role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.usertype = usertype;
    await user.save();

    if (usertype === 'freelancer') {
      await Freelancer.findOneAndUpdate(
        { userId: user._id },
        { $setOnInsert: { userId: user._id } },
        { upsert: true, new: true }
      );
    }

    return res.status(200).json({
      message: 'User role updated successfully',
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update user role' });
  }
};

const getDeletionBlocker = async (userId) => {
  const [ownedProjectsCount, assignedProjectsCount, applicationsCount] = await Promise.all([
    Project.countDocuments({ clientId: userId }),
    Project.countDocuments({ freelancerId: userId }),
    Application.countDocuments({
      $or: [{ freelancerId: userId }, { clientId: userId }]
    })
  ]);

  if (ownedProjectsCount > 0) {
    return 'Delete this user after removing or reassigning their projects';
  }

  if (assignedProjectsCount > 0) {
    return 'Delete this user after removing them from assigned projects';
  }

  if (applicationsCount > 0) {
    return 'Delete this user after clearing their related applications';
  }

  return null;
};

export const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id) {
      return res.status(400).json({ message: 'Admins cannot delete their own account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const blocker = await getDeletionBlocker(user._id);
    if (blocker) {
      return res.status(400).json({ message: blocker });
    }

    await Promise.all([
      Freelancer.deleteOne({ userId: user._id }),
      Chat.updateMany({ participants: user._id }, { $pull: { participants: user._id } }),
      User.deleteOne({ _id: user._id })
    ]);

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete user' });
  }
};
