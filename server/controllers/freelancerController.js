import { Freelancer } from '../models/Schema.js';
import { parseSkillInput } from '../utils/request.js';

export const fetchFreelancer = async (req, res) => {
  try {
    const targetUserId = req.params.id || req.user?._id;

    if (req.user.usertype === 'freelancer' && targetUserId !== req.user._id) {
      return res.status(403).json({ message: 'You can only view your own freelancer profile' });
    }

    const freelancer = await Freelancer.findOne({ userId: targetUserId });
    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer profile not found' });
    }

    return res.status(200).json(freelancer);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch freelancer profile' });
  }
};

export const updateFreelancer = async (req, res) => {
  try {
    const { updateSkills, description } = req.body;
    const freelancer = await Freelancer.findOne({ userId: req.user._id });

    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    if (updateSkills !== undefined) {
      freelancer.skills = parseSkillInput(updateSkills);
    }

    if (description !== undefined) {
      freelancer.description = String(description).trim();
    }

    await freelancer.save();
    return res.status(200).json(freelancer);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update freelancer profile' });
  }
};
