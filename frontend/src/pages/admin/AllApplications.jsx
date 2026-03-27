import { useEffect, useState } from 'react';
import api from '../../services/api';
import AppLoader from '../../components/AppLoader';

const AllApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadApplications = async () => {
      try {
        const { data } = await api.get('/application');
        if (isMounted) {
          setApplications([...data].reverse());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <AppLoader label="Loading applications..." />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="panel rounded-[32px] p-6 md:p-8">
        <span className="eyebrow">Application Oversight</span>
        <h2 className="mt-4 text-4xl font-semibold text-[#123c33]">Monitor all submitted proposals.</h2>
      </div>

      <div className="mt-6 space-y-5">
        {applications.map((app) => (
          <div key={app._id} className="panel rounded-[28px] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-[#8b775f]">Application</p>
                <h3 className="mt-2 text-2xl font-semibold text-[#123c33]">{app.title}</h3>
              </div>
              <span className={`status-pill ${String(app.status).toLowerCase()}`}>{app.status}</span>
            </div>

            <p className="muted-copy mt-4 leading-7">{app.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-sans text-[#123c33]">
              <span>Client: {app.clientName}</span>
              <span>Bid Amount: Rs {app.bidAmount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllApplications;
