import { useEffect, useState } from 'react';
import api from '../../services/api';
import AppLoader from '../../components/AppLoader';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/project');
        setProjects(data);
        setSkills([...new Set(data.flatMap((project) => project.skills || []))]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return <AppLoader label="Loading projects..." />;
  }

  const displayProjects =
    filters.length === 0
      ? projects
      : projects.filter((project) => filters.every((skill) => project.skills.includes(skill)));

  const toggleSkill = (skill) => {
    setFilters((prev) =>
      prev.includes(skill) ? prev.filter((item) => item !== skill) : [...prev, skill]
    );
  };

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
      <aside className="panel hidden w-72 rounded-[30px] p-5 lg:block">
        <span className="eyebrow">Admin Filters</span>
        <h3 className="mt-4 text-2xl font-semibold text-[#123c33]">Review by skill stack</h3>
        <div className="mt-5 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`rounded-full px-3 py-2 text-sm font-medium ${
                filters.includes(skill) ? 'brand-button' : 'ghost-button'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1">
        <div className="panel rounded-[32px] p-6 md:p-8">
          <span className="eyebrow">Project Oversight</span>
          <h2 className="mt-4 text-4xl font-semibold text-[#123c33]">Review all platform projects in one place.</h2>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          {displayProjects.map((project) => (
            <div key={project._id} className="panel stat-card rounded-[28px] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-sans text-xs uppercase tracking-[0.22em] text-[#8b775f]">Project</p>
                  <h3 className="mt-2 text-2xl font-semibold text-[#123c33]">{project.title}</h3>
                </div>
                <span className={`status-pill ${String(project.status).toLowerCase()}`}>{project.status}</span>
              </div>

              <p className="muted-copy mt-4 leading-7">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <span key={skill} className="metric-chip">{skill}</span>
                ))}
              </div>
              <p className="mt-5 font-sans font-semibold text-[#123c33]">Budget: Rs {project.budget}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminProjects;
