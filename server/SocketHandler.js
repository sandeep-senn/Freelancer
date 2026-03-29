import { Chat, Project, User } from './models/Schema.js';
import { verifyAuthToken } from './utils/auth.js';

const canAccessProjectChat = (project, userId, role) => {
  if (role === 'admin') {
    return true;
  }

  return String(project.clientId) === userId || String(project.freelancerId) === userId;
};

const buildChatPayload = (chat) => ({
  _id: chat._id,
  participants: chat.participants || [],
  messages: chat.messages || []
});

const SocketHandler = (io, socket) => {
  socket.on('join-project-chat', async ({ projectId }) => {
    try {
      if (!projectId || !socket.user) {
        return socket.emit('chat-error', { message: 'Unable to join chat' });
      }

      const project = await Project.findById(projectId);
      if (!project || !canAccessProjectChat(project, socket.user._id, socket.user.usertype)) {
        return socket.emit('chat-error', { message: 'You cannot access this chat' });
      }

      await socket.join(projectId);

      let chat = await Chat.findById(projectId);
      if (!chat) {
        chat = await Chat.create({
          _id: projectId,
          participants: [project.clientId, project.freelancerId].filter(Boolean),
          messages: []
        });
      }

      socket.emit('chat-history', buildChatPayload(chat));
    } catch (error) {
      socket.emit('chat-error', { message: 'Unable to join chat' });
    }
  });

  socket.on('send-project-message', async ({ projectId, text }) => {
    try {
      if (!projectId || !text?.trim() || !socket.user) {
        return socket.emit('chat-error', { message: 'Message text is required' });
      }

      const project = await Project.findById(projectId);
      if (!project || !canAccessProjectChat(project, socket.user._id, socket.user.usertype)) {
        return socket.emit('chat-error', { message: 'You cannot send messages in this chat' });
      }

      const chat = await Chat.findByIdAndUpdate(
        projectId,
        {
          $setOnInsert: {
            participants: [project.clientId, project.freelancerId].filter(Boolean)
          },
          $push: {
            messages: {
              senderId: socket.user._id,
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

      io.to(projectId).emit('chat-updated', buildChatPayload(chat));
    } catch (error) {
      socket.emit('chat-error', { message: 'Unable to send message' });
    }
  });
};

export const registerSocketServer = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const payload = verifyAuthToken(token);
      const user = await User.findById(payload.sub);

      if (!user) {
        return next(new Error('Invalid session'));
      }

      socket.user = {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        usertype: user.usertype
      };

      return next();
    } catch (error) {
      return next(new Error('Invalid or expired session'));
    }
  });

  io.on('connection', (socket) => {
    SocketHandler(io, socket);
  });
};

export default SocketHandler;
