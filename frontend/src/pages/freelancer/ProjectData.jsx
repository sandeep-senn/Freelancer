import { useCallback, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { GeneralContext } from '../../context/general-context';
import AppLoader from '../../components/AppLoader';

const ProjectData = () => {
  const { id } = useParams();
  const { user } = useContext(GeneralContext);
  const [project, setProject] = useState(null);
  const [chat, setChat] = useState({ messages: [] });
  const [message, setMessage] = useState('');
  const [proposal, setProposal] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [manualLink, setManualLink] = useState('');
  const [submissionDescription, setSubmissionDescription] = useState('');
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
    } catch {
      setChat({ messages: [] });
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

  const handleBid = async () => {
    try {
      await api.post('/application/bid', {
        projectId: id,
        proposal,
        bidAmount,
        estimatedTime
      });

      toast.success('Bid placed successfully');
      setProposal('');
      setBidAmount('');
      setEstimatedTime('');
      fetchProject();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Bidding failed');
    }
  };

  const handleSubmission = async () => {
    try {
      await api.post('/project/submit', {
        projectId: id,
        projectLink,
        manualLink,
        submissionDescription
      });

      toast.success('Submission successful');
      setProjectLink('');
      setManualLink('');
      setSubmissionDescription('');
      fetchProject();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Submission failed');
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

  const canChat = String(project.freelancerId || '') === user?._id || String(project.clientId) === user?._id;
  const alreadyBid = project.bids?.some((bidderId) => String(bidderId) === user?._id);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold">{project.title}</h2>
        <p className="text-gray-600">{project.description}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {project.skills?.map((skill) => (
            <span key={skill} className="bg-gray-100 px-3 py-1 rounded text-sm">
              {skill}
            </span>
          ))}
        </div>

        <p className="mt-3 font-medium">Budget: Rs {project.budget}</p>
      </div>

      {project.status === 'Pending' && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Send Proposal</h3>

          <input
            type="number"
            placeholder="Bid amount"
            value={bidAmount}
            onChange={(event) => setBidAmount(event.target.value)}
            className="w-full border p-2 rounded mb-2"
          />

          <input
            type="number"
            placeholder="Estimated time (days)"
            value={estimatedTime}
            onChange={(event) => setEstimatedTime(event.target.value)}
            className="w-full border p-2 rounded mb-2"
          />

          <textarea
            placeholder="Proposal"
            value={proposal}
            onChange={(event) => setProposal(event.target.value)}
            className="w-full border p-2 rounded mb-3"
          />

          {!alreadyBid ? (
            <button onClick={handleBid} className="bg-green-600 text-white px-4 py-2 rounded">
              Post Bid
            </button>
          ) : (
            <button disabled className="bg-gray-400 text-white px-4 py-2 rounded">
              Already Bidded
            </button>
          )}
        </div>
      )}

      {String(project.freelancerId || '') === user?._id && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Submit Project</h3>

          {project.submissionAccepted ? (
            <p className="text-green-600 font-semibold">Project Completed</p>
          ) : (
            <>
              <input
                type="text"
                placeholder="Project link"
                value={projectLink}
                onChange={(event) => setProjectLink(event.target.value)}
                className="w-full border p-2 rounded mb-2"
              />

              <input
                type="text"
                placeholder="Manual link"
                value={manualLink}
                onChange={(event) => setManualLink(event.target.value)}
                className="w-full border p-2 rounded mb-2"
              />

              <textarea
                placeholder="Work description"
                value={submissionDescription}
                onChange={(event) => setSubmissionDescription(event.target.value)}
                className="w-full border p-2 rounded mb-3"
              />

              {!project.submission ? (
                <button onClick={handleSubmission} className="bg-blue-600 text-white px-4 py-2 rounded">
                  Submit Project
                </button>
              ) : (
                <button disabled className="bg-gray-400 text-white px-4 py-2 rounded">
                  Already Submitted
                </button>
              )}
            </>
          )}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-3">Chat</h3>

        {canChat ? (
          <>
            <div className="h-64 overflow-y-auto space-y-2 mb-3">
              {chat.messages?.map((msg) => (
                <div
                  key={`${msg.timestamp}-${msg.senderId}`}
                  className={`p-2 rounded max-w-xs ${
                    String(msg.senderId) === user?._id ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="flex-1 border p-2 rounded"
                placeholder="Type message..."
              />
              <button onClick={handleMessageSend} className="bg-blue-600 text-white px-4 rounded">
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

export default ProjectData;
