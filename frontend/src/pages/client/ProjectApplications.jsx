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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Applications</h2>

        <select
          onChange={(event) => handleFilterChange(event.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">All Projects</option>
          {projectTitles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {displayApplications.map((app) => (
          <div key={app._id} className="bg-white p-5 rounded-xl shadow">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg">{app.title}</h3>
                <p className="text-gray-600">{app.description}</p>
                <p className="mt-2 font-medium">Budget: Rs {app.budget}</p>

                <div className="flex gap-2 mt-2 flex-wrap">
                  {app.requiredSkills.map((skill) => (
                    <span key={skill} className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium">Proposal</h4>
                <p className="text-gray-600">{app.proposal}</p>
                <p className="mt-2">Proposed: Rs {app.bidAmount}</p>

                <div className="flex gap-2 mt-2 flex-wrap">
                  {app.freelancerSkills.map((skill) => (
                    <span key={skill} className="bg-blue-100 px-2 py-1 rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-4">
                  {app.status === 'Pending' ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(app._id)}
                        className="bg-green-600 text-white px-4 py-1 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(app._id)}
                        className="bg-red-600 text-white px-4 py-1 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="font-semibold">Status: {app.status}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {displayApplications.length === 0 && (
          <p className="text-center text-gray-500">No applications found</p>
        )}
      </div>
    </div>
  );
};

export default ProjectApplications;
