import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AppLoader from '../../components/AppLoader';

const Client = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const { data } = await api.get('/project');
        const reversedProjects = [...data].reverse();
        setProjects(data);
        setDisplayProjects(reversedProjects);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (loading) {
    return <AppLoader label="Loading client dashboard..." />;
  }

  const handleFilterChange = (status) => {
    if (!status) {
      setDisplayProjects([...projects].reverse());
      return;
    }

    const statusMap = {
      Pending: 'Pending',
      Assigned: 'Assigned',
      Completed: 'Completed'
    };

    setDisplayProjects(
      projects.filter((project) => project.status === statusMap[status]).reverse()
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="panel rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">Client Dashboard</span>
            <h2 className="mt-4 text-xl font-semibold text-[#123c33] md:text-2xl">
              Manage active client work with confidence.
            </h2>
            <p className="muted-copy mt-3 max-w-2xl">
              Review every project from one calm workspace, track delivery status, and keep the
              execution flow clean.
            </p>
          </div>

          <select
            onChange={(event) => handleFilterChange(event.target.value)}
            className="rounded-full border border-[#123c33]/12 bg-white/80 px-4 py-3 font-sans text-sm text-[#123c33]"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="dashboard-grid mt-6">
        {displayProjects.map((project) => (
          <div
            key={project._id}
            onClick={() => navigate(`/client-project/${project._id}`)}
            className="panel stat-card cursor-pointer rounded-[28px] p-6 transition hover:-translate-y-1"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-[#8a7661]">
                  Project
                </p>
                <h3 className="mt-2 text-xl font-semibold text-[#123c33]">{project.title}</h3>
              </div>
              <span className={`status-pill ${String(project.status).toLowerCase()}`}>
                {project.status}
              </span>
            </div>

            <span className="metric-chip">{new Date(project.postedDate).toLocaleDateString()}</span>

            <p className="muted-copy mb-5 mt-4 leading-7">{project.description}</p>

            <div className="flex items-center justify-between border-t border-[#123c33]/10 pt-4 text-sm">
              <span className="font-sans font-semibold text-[#123c33]">Budget: Rs {project.budget}</span>
              <span className="font-sans text-[#6c776f]">Open project workspace</span>
            </div>
          </div>
        ))}

        {displayProjects.length === 0 && (
          <div className="panel col-span-full rounded-[28px] p-10 text-center">
            <p className="text-xl font-semibold text-[#123c33]">No projects found</p>
            <p className="muted-copy mt-3">Create a new project to start building your pipeline.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Client;
