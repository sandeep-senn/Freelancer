import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { GeneralContext } from '../../context/general-context';
import AppLoader from '../../components/AppLoader';
import { createSocketConnection } from '../../services/socket';

const ProjectWorking = () => {
  const { id } = useParams();
  const { user } = useContext(GeneralContext);
  const [project, setProject] = useState(null);
  const [chat, setChat] = useState({ messages: [] });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  const fetchProject = useCallback(async () => {
    try {
      const { data } = await api.get(`/project/${id}`);
      setProject(data);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  const fetchChat = useCallback(async () => {
    try {
      const { data } = await api.get(`/chat/project/${id}`);
      setChat(data);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const loadProjectData = async () => {
      setLoading(true);
      await Promise.all([fetchProject(), fetchChat()]);
      setLoading(false);
    };

    loadProjectData();
  }, [fetchChat, fetchProject, id]);

  useEffect(() => {
    if (!project?.freelancerId || !user?._id) {
      return undefined;
    }

    const socket = createSocketConnection();
    if (!socket) {
      return undefined;
    }

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join-project-chat', { projectId: id });
    });
    socket.on('connect_error', () => {
      fetchChat();
    });
    socket.on('chat-history', (payload) => setChat(payload));
    socket.on('chat-updated', (payload) => setChat(payload));
    socket.on('chat-error', (payload) => {
      if (payload?.message) {
        toast.error(payload.message);
      }
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [fetchChat, id, project?.freelancerId, user?._id]);

  const handleApproveSubmission = async () => {
    try {
      await api.post(`/project/approve/${id}`);
      toast.success('Submission approved');
      fetchProject();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleRejectSubmission = async () => {
    try {
      await api.post(`/project/reject/${id}`);
      toast.success('Submission rejected');
      fetchProject();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleMessageSend = async () => {
    if (!message.trim()) return;

    try {
      if (socketRef.current?.connected) {
        socketRef.current.emit('send-project-message', { projectId: id, text: message });
      } else {
        await api.post(`/chat/project/${id}/message`, { text: message });
        fetchChat();
      }

      setMessage('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Message failed');
    }
  };

  if (loading || !project) {
    return <AppLoader label="Loading project..." />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <div className="panel rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="eyebrow">Client Project View</span>
            <h2 className="mt-4 text-xl font-semibold text-[#123c33] md:text-2xl">{project.title}</h2>
            <p className="muted-copy mt-3 max-w-3xl leading-7">{project.description}</p>
          </div>
          <span className={`status-pill ${String(project.status).toLowerCase()}`}>{project.status}</span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.skills.map((skill) => (
            <span key={skill} className="metric-chip">
              {skill}
            </span>
          ))}
        </div>

        <p className="mt-5 font-sans font-semibold text-[#123c33]">Budget: Rs {project.budget}</p>
      </div>

      {project.freelancerId && (
        <div className="panel rounded-[30px] p-6">
          <h3 className="text-xl font-semibold text-[#123c33]">Submission Review</h3>

          {project.submission ? (
            <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[26px] border border-[#123c33]/10 bg-white/68 p-5">
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-[#8b775f]">Delivered Work</p>
                <p className="muted-copy mt-4 leading-7">{project.submissionDescription}</p>
                <a
                  href={project.projectLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex font-sans font-semibold text-[#123c33] underline underline-offset-4"
                >
                  Open submission link
                </a>
              </div>

              <div className="rounded-[26px] border border-[#123c33]/10 bg-white/68 p-5">
                {project.submissionAccepted ? (
                  <p className="text-xl font-semibold text-[#245437]">Project completed and approved.</p>
                ) : (
                  <>
                    <p className="muted-copy leading-7">
                      Review the submission carefully and decide whether it is ready to be approved or sent back.
                    </p>
                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={handleApproveSubmission}
                        className="brand-button rounded-full px-5 py-2.5 text-sm font-semibold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={handleRejectSubmission}
                        className="rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
                      >
                        Reject
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <p className="muted-copy mt-4">No submission has been made yet.</p>
          )}
        </div>
      )}

      <div className="panel rounded-[30px] p-6">
        <h3 className="text-xl font-semibold text-[#123c33]">Project Chat</h3>

        {project.freelancerId ? (
          <>
            <div className="mt-5 space-y-3 rounded-[28px] border border-[#123c33]/10 bg-white/68 p-4">
              {chat.messages?.length ? (
                chat.messages.map((msg) => (
                  <div
                    key={`${msg.timestamp}-${msg.senderId}`}
                    className={`max-w-lg rounded-[22px] px-4 py-3 font-sans text-sm leading-6 ${
                      String(msg.senderId) === user?._id
                        ? 'ml-auto bg-[#123c33] text-white'
                        : 'bg-[#f3ede2] text-[#123c33]'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                ))
              ) : (
                <p className="muted-copy text-sm">Messages will appear here once the conversation starts.</p>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="flex-1 rounded-2xl border border-[#123c33]/10 bg-white/80 px-4 py-3 font-sans"
                placeholder="Write a clear message..."
              />
              <button
                onClick={handleMessageSend}
                className="brand-button rounded-full px-5 py-3 text-sm font-semibold"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="muted-copy mt-4">Chat will unlock once a freelancer is assigned to the project.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectWorking;
