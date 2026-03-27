import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { GeneralContext } from '../../context/general-context';
import AppLoader from '../../components/AppLoader';

const MyProjects = () => {
  const navigate = useNavigate();
  const { user } = useContext(GeneralContext);
  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const { data } = await api.get('/project');
        const myProjects = data.filter((project) => String(project.freelancerId || '') === user?._id);
        setProjects(myProjects);
        setDisplayProjects([...myProjects].reverse());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProjects();
  }, [user?._id]);

  const handleFilterChange = (value) => {
    if (!value) {
      setDisplayProjects([...projects].reverse());
      return;
    }

    setDisplayProjects(projects.filter((project) => project.status === value).reverse());
  };

  if (loading) {
    return <AppLoader label="Loading projects..." />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="panel rounded-[32px] p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">My Projects</span>
            <h2 className="mt-4 text-4xl font-semibold text-[#123c33]">Track active and completed delivery work.</h2>
            <p className="muted-copy mt-3 max-w-2xl">
              Keep a clear view of the projects already assigned to you and monitor where each one stands.
            </p>
          </div>

          <select
            onChange={(event) => handleFilterChange(event.target.value)}
            className="rounded-full border border-[#123c33]/12 bg-white/80 px-4 py-3 font-sans text-sm text-[#123c33]"
          >
            <option value="">All Status</option>
            <option value="Assigned">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        {displayProjects.map((project) => (
          <div
            key={project._id}
            onClick={() => navigate(`/project/${project._id}`)}
            className="panel stat-card cursor-pointer rounded-[28px] p-6 transition hover:-translate-y-1"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-[#8b775f]">Assigned Project</p>
                <h3 className="mt-2 text-2xl font-semibold text-[#123c33]">{project.title}</h3>
              </div>
              <span className={`status-pill ${String(project.status).toLowerCase()}`}>{project.status}</span>
            </div>

            <p className="muted-copy mt-4 leading-7">{project.description}</p>

            <div className="mt-5 flex items-center justify-between border-t border-[#123c33]/10 pt-4 text-sm">
              <span className="font-sans font-semibold text-[#123c33]">Budget: Rs {project.budget}</span>
              <span className="muted-copy">{new Date(project.postedDate).toLocaleDateString()}</span>
            </div>
          </div>
        ))}

        {displayProjects.length === 0 && (
          <div className="panel col-span-full rounded-[28px] p-10 text-center">
            <p className="text-2xl font-semibold text-[#123c33]">No projects found</p>
            <p className="muted-copy mt-3">Assigned work will appear here once a client approves your application.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
