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

  const canChat =
    String(project.freelancerId || '') === user?._id || String(project.clientId) === user?._id;
  const alreadyBid = project.bids?.some((bidderId) => String(bidderId) === user?._id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <div className="panel rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="eyebrow">Project Detail</span>
            <h2 className="mt-4 text-4xl font-semibold text-[#123c33]">{project.title}</h2>
            <p className="muted-copy mt-3 max-w-3xl leading-7">{project.description}</p>
          </div>
          <span className={`status-pill ${String(project.status).toLowerCase()}`}>{project.status}</span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.skills?.map((skill) => (
            <span key={skill} className="metric-chip">
              {skill}
            </span>
          ))}
        </div>

        <p className="mt-5 font-sans font-semibold text-[#123c33]">Budget: Rs {project.budget}</p>
      </div>

      {project.status === 'Pending' && (
        <div className="panel rounded-[30px] p-6">
          <h3 className="text-2xl font-semibold text-[#123c33]">Send Proposal</h3>
          <p className="muted-copy mt-3 max-w-2xl">
            Position yourself clearly with a focused bid, a realistic timeline, and a concise proposal.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <input
              type="number"
              placeholder="Bid amount"
              value={bidAmount}
              onChange={(event) => setBidAmount(event.target.value)}
              className="rounded-2xl border border-[#123c33]/10 bg-white/80 px-4 py-3 font-sans"
            />
            <input
              type="number"
              placeholder="Estimated time (days)"
              value={estimatedTime}
              onChange={(event) => setEstimatedTime(event.target.value)}
              className="rounded-2xl border border-[#123c33]/10 bg-white/80 px-4 py-3 font-sans"
            />
          </div>

          <textarea
            placeholder="Explain why you are the right fit for this project."
            value={proposal}
            onChange={(event) => setProposal(event.target.value)}
            className="mt-4 min-h-36 w-full rounded-2xl border border-[#123c33]/10 bg-white/80 px-4 py-3 font-sans"
          />

          <div className="mt-5">
            {!alreadyBid ? (
              <button onClick={handleBid} className="brand-button rounded-full px-5 py-3 text-sm font-semibold">
                Submit Bid
              </button>
            ) : (
              <button disabled className="rounded-full bg-slate-300 px-5 py-3 text-sm font-semibold text-white">
                Already Applied
              </button>
            )}
          </div>
        </div>
      )}

      {String(project.freelancerId || '') === user?._id && (
        <div className="panel rounded-[30px] p-6">
          <h3 className="text-2xl font-semibold text-[#123c33]">Submit Final Delivery</h3>

          {project.submissionAccepted ? (
            <p className="mt-4 text-xl font-semibold text-[#245437]">Project completed and approved.</p>
          ) : (
            <>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Project link"
                  value={projectLink}
                  onChange={(event) => setProjectLink(event.target.value)}
                  className="rounded-2xl border border-[#123c33]/10 bg-white/80 px-4 py-3 font-sans"
                />
                <input
                  type="text"
                  placeholder="Documentation or manual link"
                  value={manualLink}
                  onChange={(event) => setManualLink(event.target.value)}
                  className="rounded-2xl border border-[#123c33]/10 bg-white/80 px-4 py-3 font-sans"
                />
              </div>

              <textarea
                placeholder="Describe what was delivered, final notes, and any handoff guidance."
                value={submissionDescription}
                onChange={(event) => setSubmissionDescription(event.target.value)}
                className="mt-4 min-h-36 w-full rounded-2xl border border-[#123c33]/10 bg-white/80 px-4 py-3 font-sans"
              />

              <div className="mt-5">
                {!project.submission ? (
                  <button
                    onClick={handleSubmission}
                    className="brand-button rounded-full px-5 py-3 text-sm font-semibold"
                  >
                    Submit Project
                  </button>
                ) : (
                  <button disabled className="rounded-full bg-slate-300 px-5 py-3 text-sm font-semibold text-white">
                    Submission Sent
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <div className="panel rounded-[30px] p-6">
        <h3 className="text-2xl font-semibold text-[#123c33]">Project Chat</h3>

        {canChat ? (
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
                    {msg.text}
                  </div>
                ))
              ) : (
                <p className="muted-copy text-sm">No conversation yet. Use this space for scoped, project-specific updates.</p>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="flex-1 rounded-2xl border border-[#123c33]/10 bg-white/80 px-4 py-3 font-sans"
                placeholder="Write a project message..."
              />
              <button onClick={handleMessageSend} className="brand-button rounded-full px-5 py-3 text-sm font-semibold">
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="muted-copy mt-4">Chat will unlock once the project is formally assigned.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectData;
