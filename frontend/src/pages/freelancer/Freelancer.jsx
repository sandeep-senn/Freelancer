import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import AppLoader from '../../components/AppLoader';
import { GeneralContext } from '../../context/general-context';

const Freelancer = () => {
  const navigate = useNavigate();
  const { user } = useContext(GeneralContext);
  const [freelancer, setFreelancer] = useState(null);
  const [applicationsCount] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [editSkills, setEditSkills] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [aiExperience, setAiExperience] = useState('');
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadFreelancer = async () => {
    try {
      const { data } = await api.get('/freelancer/me');
      setFreelancer(data);
      setEditSkills(data.skills.join(', '));
      setEditDescription(data.description || '');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      await loadFreelancer();
    };

    loadDashboard();
  }, []);

  const updateProfile = async () => {
    try {
      await api.post('/freelancer/update', {
        updateSkills: editSkills.split(',').map((skill) => skill.trim()).filter(Boolean),
        description: editDescription
      });

      toast.success('Profile updated');
      setEditOpen(false);
      loadFreelancer();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const generateDescription = async () => {
    const skillList = editSkills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (skillList.length === 0) {
      toast.warning('Add at least one skill before generating a description');
      return;
    }

    try {
      setGeneratingDescription(true);
      const { data } = await api.post('/ai/freelancer-description', {
        role: 'Freelancer',
        skills: skillList.join(', '),
        experience: aiExperience
      });

      setEditDescription(data.description || '');
      toast.success('AI description generated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to generate description');
    } finally {
      setGeneratingDescription(false);
    }
  };

  if (loading || !freelancer) {
    return <AppLoader label="Loading dashboard..." />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <div className="panel rounded-[32px] p-6 md:p-8">
        <span className="eyebrow">Freelancer Dashboard</span>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#123c33] md:text-2xl">
              Run your freelance workflow like a studio.
            </h2>
            <p className="muted-copy mt-3 max-w-2xl">
              Track assignments, position your profile clearly, and keep delivery quality visible
              from application to payout.
            </p>
          </div>
          <span className="metric-chip">Funds available: Rs {freelancer.funds}</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <DashboardCard
          title="Current Projects"
          value={freelancer.currentProjects.length}
          onClick={() => navigate('/my-projects')}
        />
        <DashboardCard
          title="Completed Projects"
          value={freelancer.completedProjects.length}
          onClick={() => navigate('/my-projects')}
        />
        <DashboardCard
          title="Applications"
          value={applicationsCount}
          onClick={() => navigate('/myApplications')}
        />
        <DashboardCard title="Funds" value={`Rs ${freelancer.funds}`} />
      </div>

      <div className="panel rounded-[32px] p-6 md:p-8">
        {!editOpen ? (
          <>
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-[#8b775f]">Profile</p>
                <h3 className="mt-2 text-xl font-semibold text-[#123c33] md:text-2xl">
                  Professional Snapshot
                </h3>
              </div>
              <button
                onClick={() => setEditOpen(true)}
                className="ghost-button rounded-full px-5 py-2.5 font-sans text-sm font-semibold"
              >
                Update Profile
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[28px] border border-[#123c33]/10 bg-white/65 p-5">
                <h4 className="text-xl font-semibold text-[#123c33]">Description</h4>
                <p className="muted-copy mt-3 leading-7">
                  {freelancer.description ||
                    'Add a sharper positioning statement to help clients trust your fit faster.'}
                </p>
              </div>

              <div className="rounded-[28px] border border-[#123c33]/10 bg-white/65 p-5">
                <h4 className="text-xl font-semibold text-[#123c33]">Skills</h4>
                <div className="mt-4 flex gap-2 flex-wrap">
                  {freelancer.skills.length > 0 ? (
                    freelancer.skills.map((skill) => (
                      <span key={skill} className="metric-chip">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="muted-copy">No skills added</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <h3 className="mb-5 text-xl font-semibold text-[#123c33] md:text-2xl">Update Profile</h3>

            <div className="mb-3">
              <label className="mb-2 block font-sans text-sm font-medium text-[#123c33]">Skills</label>
              <input
                value={editSkills}
                onChange={(event) => setEditSkills(event.target.value)}
                className="w-full rounded-2xl border border-[#123c33]/10 bg-white/80 px-4 py-3 font-sans"
                placeholder="React, Node, MongoDB"
              />
            </div>

            <div className="mb-3">
              <label className="mb-2 block font-sans text-sm font-medium text-[#123c33]">
                Experience
              </label>
              <input
                value={aiExperience}
                onChange={(event) => setAiExperience(event.target.value)}
                className="w-full rounded-2xl border border-[#123c33]/10 bg-white/80 px-4 py-3 font-sans"
                placeholder="e.g. 3 years in React and Node.js"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block font-sans text-sm font-medium text-[#123c33]">
                Description
              </label>
              <textarea
                value={editDescription}
                onChange={(event) => setEditDescription(event.target.value)}
                className="w-full rounded-2xl border border-[#123c33]/10 bg-white/80 px-4 py-3 font-sans"
                rows="4"
              />
            </div>

            <div className="mb-5 rounded-[24px] border border-[#123c33]/10 bg-white/68 p-4">
              <p className="font-sans text-xs uppercase tracking-[0.22em] text-[#8b775f]">AI Helper</p>
              <p className="muted-copy mt-2 text-sm leading-6">
                Generate a sharper profile summary for {user?.username || 'your account'} using your
                listed skills and experience.
              </p>
              <button
                onClick={generateDescription}
                disabled={generatingDescription}
                className="ghost-button mt-4 rounded-full px-5 py-2.5 font-sans text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
              >
                {generatingDescription ? 'Generating...' : 'Generate With AI'}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={updateProfile}
                className="brand-button rounded-full px-5 py-2.5 font-sans text-sm font-semibold"
              >
                Save
              </button>
              <button
                onClick={() => setEditOpen(false)}
                className="ghost-button rounded-full px-5 py-2.5 font-sans text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, onClick }) => (
  <div
    onClick={onClick}
    className="panel stat-card cursor-pointer rounded-[28px] p-6 transition hover:-translate-y-1"
  >
    <p className="font-sans text-xs uppercase tracking-[0.22em] text-[#8b775f]">{title}</p>
    <p className="mt-4 text-xl font-semibold text-[#123c33] md:text-2xl">{value}</p>
    <p className="muted-copy mt-3 text-sm">Open workspace</p>
  </div>
);

export default Freelancer;
