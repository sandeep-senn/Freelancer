import { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { GeneralContext } from '../../context/general-context';
import AppLoader from '../../components/AppLoader';

const ProjectWorking = () => {
  const { id } = useParams();
  const { user } = useContext(GeneralContext);
  const [project, setProject] = useState(null);
  const [chat, setChat] = useState({ messages: [] });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

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
      await api.post(`/chat/project/${id}/message`, { text: message });
      setMessage('');
      fetchChat();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Message failed');
    }
  };

  if (loading || !project) {
    return <AppLoader label="Loading project..." />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold">{project.title}</h2>
        <p className="text-gray-600">{project.description}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {project.skills.map((skill) => (
            <span key={skill} className="bg-gray-100 px-3 py-1 rounded text-sm">
              {skill}
            </span>
          ))}
        </div>

        <p className="mt-3 font-medium">Budget: Rs {project.budget}</p>
      </div>

      {project.freelancerId && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold text-lg mb-2">Submission</h3>

          {project.submission ? (
            <>
              <p>
                <b>Project:</b>{' '}
                <a
                  href={project.projectLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              </p>

              <p className="mt-2">{project.submissionDescription}</p>

              {project.submissionAccepted ? (
                <p className="text-green-600 mt-3 font-semibold">Project Completed</p>
              ) : (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleApproveSubmission}
                    className="bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={handleRejectSubmission}
                    className="bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>No submission yet</p>
          )}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-3">Chat</h3>

        {project.freelancerId ? (
          <>
            <div className="h-64 overflow-y-auto space-y-2 mb-3">
              {chat.messages?.map((msg) => (
                <div
                  key={`${msg.timestamp}-${msg.senderId}`}
                  className={`p-2 rounded max-w-xs ${
                    String(msg.senderId) === user?._id ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="flex-1 border px-3 py-2 rounded"
                placeholder="Type message..."
              />
              <button
                onClick={handleMessageSend}
                className="bg-blue-600 text-white px-4 rounded"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Chat enabled after project assignment</p>
        )}
      </div>
    </div>
  );
};

export default ProjectWorking;
