import { Chat, Project } from '../models/Schema.js';

const canAccessProjectChat = (project, userId, role) => {
  if (role === 'admin') {
    return true;
  }

  return String(project.clientId) === userId || String(project.freelancerId) === userId;
};

export const fetchChats = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!canAccessProjectChat(project, req.user._id, req.user.usertype)) {
      return res.status(403).json({ message: 'You cannot access this chat' });
    }

    const chat = await Chat.findById(req.params.projectId);
    return res.status(200).json(chat || { messages: [] });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch chat' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!canAccessProjectChat(project, req.user._id, req.user.usertype)) {
      return res.status(403).json({ message: 'You cannot send messages in this chat' });
    }

    if (!text?.trim()) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const chat = await Chat.findByIdAndUpdate(
      req.params.projectId,
      {
        $setOnInsert: {
          participants: [project.clientId, project.freelancerId].filter(Boolean)
        },
        $push: {
          messages: {
            senderId: req.user._id,
            text: text.trim(),
            timestamp: new Date()
          }
        }
      },
      {
        new: true,
        upsert: true
      }
    );

    return res.status(201).json(chat);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to send message' });
  }
};
