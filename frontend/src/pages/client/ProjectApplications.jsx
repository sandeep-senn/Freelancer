import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import AppLoader from '../../components/AppLoader';

const ProjectApplications = () => {
  const [applications, setApplications] = useState([]);
  const [displayApplications, setDisplayApplications] = useState([]);
  const [projectTitles, setProjectTitles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const { data } = await api.get('/application');
      setApplications(data);
      setDisplayApplications([...data].reverse());
      setProjectTitles([...new Set(data.map((application) => application.title))]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadApplications = async () => {
      await fetchApplications();
    };

    loadApplications();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.post(`/application/approve/${id}`);
      toast.success('Application approved');
      fetchApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post(`/application/reject/${id}`);
      toast.success('Application rejected');
      fetchApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleFilterChange = (value) => {
    if (!value) {
      setDisplayApplications([...applications].reverse());
      return;
    }

    setDisplayApplications(applications.filter((app) => app.title === value).reverse());
  };

  if (loading) {
    return <AppLoader label="Loading applications..." />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="panel rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">Applications Review</span>
            <h2 className="mt-4 text-4xl font-semibold text-[#123c33]">Compare proposals with better clarity.</h2>
            <p className="muted-copy mt-3 max-w-2xl">
              Filter by project, review fit, and move faster when it is time to approve the right freelancer.
            </p>
          </div>

          <select
            onChange={(event) => handleFilterChange(event.target.value)}
            className="rounded-full border border-[#123c33]/12 bg-white/80 px-4 py-3 font-sans text-sm text-[#123c33]"
          >
            <option value="">All Projects</option>
            {projectTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {displayApplications.map((app) => (
          <div key={app._id} className="panel rounded-[30px] p-6">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-sans text-xs uppercase tracking-[0.22em] text-[#8b775f]">Project</p>
                    <h3 className="mt-2 text-2xl font-semibold text-[#123c33]">{app.title}</h3>
                  </div>
                  <span className={`status-pill ${String(app.status).toLowerCase()}`}>
                    {app.status}
                  </span>
                </div>

                <p className="muted-copy mt-4 leading-7">{app.description}</p>
                <p className="mt-4 font-sans font-semibold text-[#123c33]">Budget: Rs {app.budget}</p>

                <div className="mt-4 flex gap-2 flex-wrap">
                  {app.requiredSkills.map((skill) => (
                    <span key={skill} className="metric-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-[#123c33]/10 bg-white/68 p-5">
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-[#8b775f]">Freelancer Proposal</p>
                <p className="muted-copy mt-4 leading-7">{app.proposal || 'No proposal added.'}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {app.freelancerSkills.map((skill) => (
                    <span key={skill} className="rounded-full bg-[#f6e7d2] px-3 py-1 text-sm font-medium text-[#8b5818]">
                      {skill}
                    </span>
                  ))}
                </div>

                <p className="mt-5 font-sans font-semibold text-[#123c33]">Proposed: Rs {app.bidAmount}</p>

                <div className="mt-5">
                  {app.status === 'Pending' ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(app._id)}
                        className="brand-button rounded-full px-5 py-2.5 text-sm font-semibold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(app._id)}
                        className="rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <p className="muted-copy text-sm">Decision already recorded for this application.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {displayApplications.length === 0 && (
          <div className="panel rounded-[28px] p-10 text-center">
            <p className="text-2xl font-semibold text-[#123c33]">No applications found</p>
            <p className="muted-copy mt-3">Applications will appear here once freelancers start applying.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectApplications;
