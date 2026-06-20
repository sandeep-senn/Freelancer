import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AppLoader from '../../components/AppLoader';

const AllProjects = () => {
  const navigate = useNavigate();
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

  const displayProjects = useMemo(() => {
    let filtered = projects;

    if (filters.length > 0) {
      filtered = projects.filter((project) => filters.every((skill) => project.skills?.includes(skill)));
    }

    return [...filtered].reverse();
  }, [projects, filters]);

  const toggleSkill = (skill) => {
    setFilters((previousFilters) =>
      previousFilters.includes(skill)
        ? previousFilters.filter((currentSkill) => currentSkill !== skill)
        : [...previousFilters, skill]
    );
  };

  if (loading) {
    return <AppLoader label="Loading projects..." />;
  }

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
      <aside className="panel hidden w-72 rounded-[30px] p-5 lg:block">
        <span className="eyebrow">Project Filters</span>
        <h3 className="mt-4 text-xl font-semibold text-[#0d1e36]">Find the right fit</h3>
        <div className="mt-5 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`rounded-full px-3 py-2 text-sm font-medium ${
                filters.includes(skill)
                  ? 'brand-button'
                  : 'ghost-button'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1">
        <div className="panel rounded-[32px] p-6 md:p-8">
          <span className="eyebrow">All Projects</span>
          <h2 className="mt-4 text-xl font-semibold text-[#0d1e36] md:text-2xl">Explore opportunities with clearer scope.</h2>
          <p className="muted-copy mt-3 max-w-3xl">
            Browse verified projects, filter by skill, and focus on work that matches your strengths.
          </p>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          {displayProjects.map((project) => {
            const bidsCount = project.bids?.length || 0;
            const avgBid =
              project.bidAmounts?.length > 0
                ? (project.bidAmounts.reduce((a, b) => a + b, 0) / project.bidAmounts.length).toFixed(0)
                : 0;

            return (
              <div
                key={project._id}
                onClick={() => navigate(`/project/${project._id}`)}
                className="panel stat-card cursor-pointer rounded-[28px] p-6 transition hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-sans text-xs uppercase tracking-[0.22em] text-[#8b775f]">Opportunity</p>
                    <h3 className="mt-2 text-xl font-semibold text-[#0d1e36]">{project.title}</h3>
                  </div>
                  <span className={`status-pill ${String(project.status).toLowerCase()}`}>{project.status}</span>
                </div>

                <p className="muted-copy mt-4 leading-7">{project.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(project.skills || []).map((skill) => (
                    <span key={skill} className="metric-chip">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#0d1e36]/10 pt-4 text-sm">
                  <span className="font-sans font-semibold text-[#0d1e36]">Budget: Rs {project.budget}</span>
                  <span className="muted-copy">{bidsCount} bids • Avg Rs {avgBid}</span>
                </div>
              </div>
            );
          })}

          {displayProjects.length === 0 && (
            <div className="panel col-span-full rounded-[28px] p-10 text-center">
              <p className="text-xl font-semibold text-[#0d1e36]">No matching projects</p>
              <p className="muted-copy mt-3">Try clearing your filters to explore more opportunities.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllProjects;
