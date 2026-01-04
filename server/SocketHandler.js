import { Chat, Project } from "./Schema.js";
import { v4 as uuid } from "uuid";

const SocketHandler = (io, socket) => {

  // ================= FREELANCER JOIN =================
  socket.on("join-chat-room", async ({ projectId, freelancerId }) => {
    try {
      const project = await Project.findById(projectId);
      if (!project) return;

      if (String(project.freelancerId) !== String(freelancerId)) return;

      await socket.join(projectId);

      let chat = await Chat.findById(projectId);

      if (!chat) {
        chat = new Chat({
          _id: projectId,
          messages: []
        });
        await chat.save();
      }

      io.to(projectId).emit("messages-updated", { chat });
    } catch (err) {
      console.error(err);
    }
  });

  // ================= CLIENT JOIN =================
  socket.on("join-chat-room-client", async ({ projectId, clientId }) => {
    try {
      const project = await Project.findById(projectId);
      if (!project) return;

      if (
        String(project.clientId) !== String(clientId) ||
        (project.status !== "Assigned" && project.status !== "Completed")
      )
        return;

      await socket.join(projectId);

      let chat = await Chat.findById(projectId);

      if (!chat) {
        chat = new Chat({
          _id: projectId,
          messages: []
        });
        await chat.save();
      }

      io.to(projectId).emit("messages-updated", { chat });
    } catch (err) {
      console.error(err);
    }
  });

  // ================= NEW MESSAGE =================
  socket.on("new-message", async ({ projectId, senderId, message, time }) => {
    try {
      const chat = await Chat.findByIdAndUpdate(
        projectId,
        {
          $push: {
            messages: {
              id: uuid(),
              text: message,
              senderId,
              time
            }
          }
        },
        { new: true }
      );

      io.to(projectId).emit("messages-updated", { chat });
    } catch (err) {
      console.error(err);
    }
  });

};

export default SocketHandler;
