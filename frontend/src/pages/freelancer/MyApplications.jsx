import { useEffect, useState } from 'react';
import api from '../../services/api';
import AppLoader from '../../components/AppLoader';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const { data } = await api.get('/application');
        setApplications([...data].reverse());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyApplications();
  }, []);

  if (loading) {
    return <AppLoader label="Loading applications..." />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="panel rounded-[32px] p-6 md:p-8">
        <span className="eyebrow">My Applications</span>
        <h2 className="mt-4 text-xl font-semibold text-[#123c33] md:text-2xl">Keep track of every proposal you send.</h2>
        <p className="muted-copy mt-3 max-w-2xl">
          Review the projects you have applied to, your proposal quality, and where each opportunity currently stands.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {applications.map((app) => (
          <div key={app._id} className="panel rounded-[30px] p-6">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-sans text-xs uppercase tracking-[0.22em] text-[#8b775f]">Applied Project</p>
                    <h3 className="mt-2 text-xl font-semibold text-[#123c33]">{app.title}</h3>
                  </div>
                  <span className={`status-pill ${String(app.status).toLowerCase()}`}>{app.status}</span>
                </div>

                <p className="muted-copy mt-4 leading-7">{app.description}</p>
                <p className="mt-4 font-sans font-semibold text-[#123c33]">Budget: Rs {app.budget}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {app.requiredSkills.map((skill) => (
                    <span key={skill} className="metric-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-[#123c33]/10 bg-white/68 p-5">
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-[#8b775f]">Your Proposal</p>
                <p className="muted-copy mt-4 leading-7">{app.proposal || 'No proposal added.'}</p>
                <p className="mt-5 font-sans font-semibold text-[#123c33]">Proposed: Rs {app.bidAmount}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {app.freelancerSkills.map((skill) => (
                    <span key={skill} className="rounded-full bg-[#f6e7d2] px-3 py-1 text-sm font-medium text-[#8b5818]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {applications.length === 0 && (
          <div className="panel rounded-[28px] p-10 text-center">
            <p className="text-xl font-semibold text-[#123c33]">No applications yet</p>
            <p className="muted-copy mt-3">Your submitted bids will appear here once you start applying.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
